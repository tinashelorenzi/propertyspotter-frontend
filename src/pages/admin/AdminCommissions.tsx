import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  adminApi,
  formatDate,
  formatMoney,
  formatMoneyPrecise,
  monthLabel,
} from '../../services/adminApi';
import type {
  AdminCommission,
  CommissionSummary,
  PayableLead,
} from '../../services/adminApi';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  ErrorBlock,
  Field,
  LoadingBlock,
  Modal,
  Pagination,
  SectionHeader,
  Select,
  StatTile,
  TableShell,
  Td,
  TextArea,
  TextInput,
  Th,
  ToastStack,
} from '../../components/admin/ui';
import { GroupedBarChart, HorizontalBars, SERIES } from '../../components/admin/charts';
import { useToasts } from '../../hooks/useToasts';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved — ready to pay' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

const AdminCommissions = () => {
  const { toasts, push, dismiss } = useToasts();

  const [commissions, setCommissions] = useState<AdminCommission[]>([]);
  const [count, setCount] = useState(0);
  const [summary, setSummary] = useState<CommissionSummary | null>(null);
  const [payable, setPayable] = useState<PayableLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [payTarget, setPayTarget] = useState<AdminCommission | null>(null);
  const [payForm, setPayForm] = useState({
    payment_reference: '',
    payment_method: 'EFT',
    payment_date: new Date().toISOString().slice(0, 10),
    notify: true,
  });

  const [raiseTarget, setRaiseTarget] = useState<PayableLead | null>(null);
  const [raiseForm, setRaiseForm] = useState({ total: '', notes: '' });

  const [cancelTarget, setCancelTarget] = useState<AdminCommission | null>(null);
  const [showPayableQueue, setShowPayableQueue] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(
    () => ({
      page,
      status: statusFilter || undefined,
      search: search || undefined,
      ordering: '-created_at',
    }),
    [page, statusFilter, search]
  );

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.listCommissions(query);
      setCommissions(response.results ?? []);
      setCount(response.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load commissions');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadAside = useCallback(async () => {
    try {
      const [summaryData, payableData] = await Promise.all([
        adminApi.commissionSummary(),
        adminApi.payableLeads(),
      ]);
      setSummary(summaryData);
      setPayable(payableData.results ?? []);
    } catch (err) {
      push(err instanceof Error ? err.message : String(err), 'error');
    }
  }, [push]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  useEffect(() => {
    loadAside();
  }, [loadAside]);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      push(err instanceof Error ? err.message : 'The action failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleApprove = (commission: AdminCommission) =>
    run(async () => {
      const result = await adminApi.approveCommission(commission.id);
      push(result.message);
      await Promise.all([loadList(), loadAside()]);
    });

  const openPay = (commission: AdminCommission) => {
    setPayTarget(commission);
    setPayForm({
      payment_reference: commission.payment_reference || `PS-${commission.id}`,
      payment_method: commission.payment_method || 'EFT',
      payment_date: new Date().toISOString().slice(0, 10),
      notify: true,
    });
  };

  const handlePay = () =>
    run(async () => {
      if (!payTarget) return;
      const result = await adminApi.payCommission(payTarget.id, payForm);
      push(result.message);
      setPayTarget(null);
      await Promise.all([loadList(), loadAside()]);
    });

  const handleCancel = () =>
    run(async () => {
      if (!cancelTarget) return;
      await adminApi.cancelCommission(cancelTarget.id, 'Cancelled from the admin dashboard');
      push('Commission cancelled');
      setCancelTarget(null);
      await Promise.all([loadList(), loadAside()]);
    });

  const openRaise = (lead: PayableLead) => {
    setRaiseTarget(lead);
    setRaiseForm({ total: lead.agreed_commission_amount ?? '', notes: '' });
  };

  const handleRaise = () =>
    run(async () => {
      if (!raiseTarget) return;
      if (!raiseForm.total) {
        push('Enter the agreed commission amount', 'error');
        return;
      }
      await adminApi.createCommission({
        lead_id: raiseTarget.id,
        total_commission_amount: raiseForm.total,
        notes: raiseForm.notes,
      });
      push('Commission raised — it is now pending approval');
      setRaiseTarget(null);
      await Promise.all([loadList(), loadAside()]);
    });

  const monthlyData = (summary?.monthly_payouts ?? []).map((row) => ({
    label: monthLabel(row.month),
    fullLabel: row.month,
    values: [Number(row.amount)],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Commission payments</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Spotters earn 5% of the agreed commission; the platform keeps 2.5%.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={payable.length > 0 ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setShowPayableQueue(true)}
          >
            {payable.length > 0
              ? `${payable.length} lead${payable.length === 1 ? '' : 's'} ready to bill`
              : 'Nothing to bill'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              loadList();
              loadAside();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Money at a glance */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            label="Pending approval"
            value={formatMoney(summary.by_status.pending?.amount)}
            hint={`${summary.by_status.pending?.count ?? 0} record(s)`}
            tone="amber"
          />
          <StatTile
            label="Approved, awaiting payment"
            value={formatMoney(summary.by_status.approved?.amount)}
            hint={`${summary.by_status.approved?.count ?? 0} record(s)`}
            tone="blue"
          />
          <StatTile
            label="Paid to spotters"
            value={formatMoney(summary.by_status.paid?.amount)}
            hint={`${summary.by_status.paid?.count ?? 0} payment(s)`}
            tone="green"
          />
          <StatTile
            label="Platform fees earned"
            value={formatMoney(summary.totals.total_platform_fees)}
            hint={`from ${formatMoney(summary.totals.total_commission)} in commission`}
            tone="default"
          />
        </div>
      )}

      {/* Charts */}
      {summary && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <Card className="xl:col-span-2">
            <SectionHeader
              title="Spotter payouts by month"
              subtitle="Actual money paid out over the last 12 months"
            />
            {monthlyData.length === 0 ? (
              <p className="text-sm text-gray-500 py-10 text-center">
                No payments have been made yet.
              </p>
            ) : (
              <GroupedBarChart
                data={monthlyData}
                series={[{ name: 'Paid to spotters', color: SERIES.primary }]}
                valueFormatter={(value) => formatMoney(value)}
              />
            )}
          </Card>

          <Card>
            <SectionHeader title="Top earners" subtitle="Spotters by amount paid" />
            <HorizontalBars
              items={summary.top_spotters.map((spotter) => ({
                key: spotter.id,
                label: spotter.name,
                value: Number(spotter.amount),
                sublabel: `${spotter.count} payment(s)`,
              }))}
              color={SERIES.green}
              valueFormatter={(value) => formatMoney(value)}
              emptyLabel="No payouts yet"
            />
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <TextInput
              placeholder="Search reference, lead, spotter…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {error && <ErrorBlock message={error} onRetry={loadList} />}

      <Card padded={false}>
        {loading ? (
          <LoadingBlock label="Loading commissions…" />
        ) : commissions.length === 0 ? (
          <EmptyState
            title="No commission records"
            message="Raise a commission from a closed lead to start tracking a payout."
            action={
              payable.length > 0 ? (
                <Button onClick={() => setShowPayableQueue(true)}>
                  Bill a closed lead
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr className="bg-gray-50/70">
                  <Th>Lead</Th>
                  <Th>Spotter</Th>
                  <Th>Agency</Th>
                  <Th className="text-right">Total commission</Th>
                  <Th className="text-right">Spotter payout</Th>
                  <Th>Status</Th>
                  <Th>Paid</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-gray-50/70 transition-colors">
                    <Td>
                      <p className="font-semibold text-gray-900">{commission.lead_detail.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {[commission.lead_detail.street_address, commission.lead_detail.suburb]
                          .filter(Boolean)
                          .join(', ') || '—'}
                      </p>
                    </Td>
                    <Td className="text-gray-600">
                      <p>{commission.spotter?.full_name ?? '—'}</p>
                      {commission.spotter_banking?.account_number && (
                        <p className="text-xs text-gray-400">
                          {commission.spotter_banking.bank_name} ····
                          {commission.spotter_banking.account_number.slice(-4)}
                        </p>
                      )}
                    </Td>
                    <Td className="text-gray-600 truncate max-w-[140px]">
                      {commission.agency?.name ?? '—'}
                    </Td>
                    <Td className="text-right tabular-nums text-gray-900">
                      {formatMoneyPrecise(commission.total_commission_amount)}
                    </Td>
                    <Td className="text-right tabular-nums font-bold text-gray-900">
                      {formatMoneyPrecise(commission.spotter_commission_amount)}
                    </Td>
                    <Td>
                      <Badge status={commission.status} label={commission.status_display} />
                    </Td>
                    <Td className="text-gray-500 whitespace-nowrap">
                      {commission.payment_date ? (
                        <>
                          <p>{formatDate(commission.payment_date)}</p>
                          <p className="text-xs text-gray-400">
                            {commission.payment_reference || 'no ref'}
                          </p>
                        </>
                      ) : (
                        '—'
                      )}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-2">
                        {commission.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleApprove(commission)}
                            disabled={busy}
                          >
                            Approve
                          </Button>
                        )}
                        {(commission.status === 'approved' || commission.status === 'pending') && (
                          <Button size="sm" onClick={() => openPay(commission)} disabled={busy}>
                            Mark paid
                          </Button>
                        )}
                        {commission.status !== 'paid' && commission.status !== 'cancelled' && (
                          <button
                            onClick={() => setCancelTarget(commission)}
                            className="text-xs font-semibold text-gray-400 hover:text-red-600"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={page} pageSize={PAGE_SIZE} total={count} onChange={setPage} />
          </>
        )}
      </Card>

      {/* Payable-leads queue */}
      <Modal
        open={showPayableQueue}
        onClose={() => setShowPayableQueue(false)}
        title="Leads ready to bill"
        subtitle="Closed or accepted leads with an agreed commission but no payment record yet"
        size="lg"
      >
        {payable.length === 0 ? (
          <p className="text-sm text-gray-500 py-6 text-center">
            Every eligible lead already has a commission record.
          </p>
        ) : (
          <ul className="space-y-3">
            {payable.map((lead) => (
              <li
                key={lead.id}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 p-4"
              >
                <div className="flex-1 min-w-[180px]">
                  <p className="font-semibold text-gray-900">{lead.name}</p>
                  <p className="text-xs text-gray-500">
                    {[lead.street_address, lead.suburb].filter(Boolean).join(', ') || '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Spotter: {lead.spotter?.name ?? '—'}
                    {lead.agency_name ? ` · ${lead.agency_name}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Agreed commission</p>
                  <p className="font-bold text-gray-900 tabular-nums">
                    {formatMoneyPrecise(lead.agreed_commission_amount)}
                  </p>
                </div>
                <Button size="sm" onClick={() => openRaise(lead)}>
                  Raise payment
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {/* Raise commission */}
      <Modal
        open={raiseTarget !== null}
        onClose={() => setRaiseTarget(null)}
        title="Raise a commission payment"
        subtitle={raiseTarget ? `For lead: ${raiseTarget.name}` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRaiseTarget(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleRaise} disabled={busy}>
              {busy ? 'Creating…' : 'Create record'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field
            label="Total agreed commission (R)"
            hint="The spotter's 5% share and the 2.5% platform fee are worked out automatically."
          >
            <TextInput
              type="number"
              step="0.01"
              value={raiseForm.total}
              onChange={(e) => setRaiseForm({ ...raiseForm, total: e.target.value })}
            />
          </Field>
          {raiseForm.total && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Spotter gets</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatMoneyPrecise(Number(raiseForm.total) * 0.05)}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Platform fee</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatMoneyPrecise(Number(raiseForm.total) * 0.025)}
                </p>
              </div>
            </div>
          )}
          <Field label="Internal notes (optional)">
            <TextArea
              rows={2}
              value={raiseForm.notes}
              onChange={(e) => setRaiseForm({ ...raiseForm, notes: e.target.value })}
            />
          </Field>
        </div>
      </Modal>

      {/* Mark paid */}
      <Modal
        open={payTarget !== null}
        onClose={() => setPayTarget(null)}
        title="Record a payment"
        subtitle={
          payTarget
            ? `${formatMoneyPrecise(payTarget.spotter_commission_amount)} to ${
                payTarget.spotter?.full_name ?? 'the spotter'
              }`
            : undefined
        }
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPayTarget(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={busy}>
              {busy ? 'Saving…' : 'Mark as paid'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {payTarget?.spotter_banking?.account_number ? (
            <div className="rounded-xl bg-gray-50 p-4 text-sm space-y-1">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Banking details on file
              </p>
              <p className="text-gray-700">
                {payTarget.spotter_banking.account_name} · {payTarget.spotter_banking.bank_name}
              </p>
              <p className="text-gray-700">
                Acct {payTarget.spotter_banking.account_number} · Branch{' '}
                {payTarget.spotter_banking.branch_code ?? '—'}
              </p>
              <p className="text-gray-500 text-xs">{payTarget.spotter_banking.account_type}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 p-4">
              <p className="text-sm text-[#B45309]">
                This spotter has not added banking details yet — confirm them before paying.
              </p>
            </div>
          )}

          <Field label="Payment reference">
            <TextInput
              value={payForm.payment_reference}
              onChange={(e) => setPayForm({ ...payForm, payment_reference: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Method">
              <Select
                value={payForm.payment_method}
                onChange={(e) => setPayForm({ ...payForm, payment_method: e.target.value })}
              >
                <option value="EFT">EFT</option>
                <option value="Instant EFT">Instant EFT</option>
                <option value="Cash">Cash</option>
                <option value="Other">Other</option>
              </Select>
            </Field>
            <Field label="Payment date">
              <TextInput
                type="date"
                value={payForm.payment_date}
                onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })}
              />
            </Field>
          </div>
          <Checkbox
            label="Email the spotter that they have been paid"
            checked={payForm.notify}
            onChange={(v) => setPayForm({ ...payForm, notify: v })}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel this commission?"
        message="The record stays on file but is marked cancelled and will not be paid."
        confirmLabel="Cancel commission"
        destructive
        busy={busy}
        onConfirm={handleCancel}
        onCancel={() => setCancelTarget(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default AdminCommissions;
