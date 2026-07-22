import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  adminApi,
  formatDate,
  formatMoney,
} from '../../services/adminApi';
import type { AdminAgency, AdminLead, UserBrief } from '../../services/adminApi';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBlock,
  LoadingBlock,
  Pagination,
  Select,
  TableShell,
  Td,
  TextInput,
  Th,
  ToastStack,
} from '../../components/admin/ui';
import LeadDetailPanel from '../../components/admin/LeadDetailPanel';
import { useToasts } from '../../hooks/useToasts';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

const AdminLeads = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toasts, push, dismiss } = useToasts();

  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [agents, setAgents] = useState<UserBrief[]>([]);
  const [agencies, setAgencies] = useState<AdminAgency[]>([]);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [unassignedOnly, setUnassignedOnly] = useState(
    searchParams.get('unassigned') === 'true'
  );
  const [ordering, setOrdering] = useState('-created_at');

  const [selectedId, setSelectedId] = useState<number | null>(
    searchParams.get('lead') ? Number(searchParams.get('lead')) : null
  );

  // Debounce the free-text search
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
      search: search || undefined,
      status: status || undefined,
      agency: agencyFilter || undefined,
      unassigned: unassignedOnly ? true : undefined,
      ordering,
    }),
    [page, search, status, agencyFilter, unassignedOnly, ordering]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.listLeads(query);
      setLeads(response.results ?? []);
      setCount(response.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    Promise.all([adminApi.listAgents(), adminApi.listAgencies()])
      .then(([agentList, agencyList]) => {
        setAgents(agentList);
        setAgencies(agencyList);
      })
      .catch((err) => push(err instanceof Error ? err.message : String(err), 'error'));
  }, [push]);

  const handleSort = (key: string) => {
    setOrdering((current) => (current === key ? `-${key}` : key));
    setPage(1);
  };

  const openLead = (id: number) => {
    setSelectedId(id);
    const next = new URLSearchParams(searchParams);
    next.set('lead', String(id));
    setSearchParams(next, { replace: true });
  };

  const closeLead = () => {
    setSelectedId(null);
    const next = new URLSearchParams(searchParams);
    next.delete('lead');
    setSearchParams(next, { replace: true });
  };

  const handleChanged = (updated: AdminLead) => {
    setLeads((current) =>
      current.map((lead) => (lead.id === updated.id ? { ...lead, ...updated } : lead))
    );
  };

  const handleDeleted = (id: number) => {
    setLeads((current) => current.filter((lead) => lead.id !== id));
    setCount((current) => Math.max(0, current - 1));
  };

  const clearFilters = () => {
    setSearchInput('');
    setStatus('');
    setAgencyFilter('');
    setUnassignedOnly(false);
    setPage(1);
  };

  const hasFilters = Boolean(search || status || agencyFilter || unassignedOnly);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Leads</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {count.toLocaleString()} lead{count === 1 ? '' : 's'}
            {hasFilters ? ' matching your filters' : ' in the system'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {/* Filters — one row above the table */}
      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          <div className="lg:col-span-2">
            <TextInput
              placeholder="Search name, phone, address, spotter…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <Select
            value={agencyFilter}
            onChange={(e) => {
              setAgencyFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All agencies</option>
            {agencies.map((agency) => (
              <option key={agency.id} value={agency.id}>
                {agency.name}
              </option>
            ))}
          </Select>
          <div className="flex items-center gap-3">
            <Button
              variant={unassignedOnly ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setUnassignedOnly((v) => !v);
                setPage(1);
              }}
            >
              Unassigned only
            </Button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-gray-500 hover:text-[#225AE3] whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </Card>

      {error && <ErrorBlock message={error} onRetry={load} />}

      <Card padded={false}>
        {loading ? (
          <LoadingBlock label="Loading leads…" />
        ) : leads.length === 0 ? (
          <EmptyState
            title="No leads found"
            message={
              hasFilters
                ? 'Nothing matches these filters. Try widening your search.'
                : 'Once spotters start submitting properties, they will appear here.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr className="bg-gray-50/70">
                  <Th sortKey="created_at" activeSort={ordering} onSort={handleSort}>
                    Received
                  </Th>
                  <Th>Lead</Th>
                  <Th>Property</Th>
                  <Th>Spotter</Th>
                  <Th>Routed to</Th>
                  <Th sortKey="status" activeSort={ordering} onSort={handleSort}>
                    Status
                  </Th>
                  <Th className="text-right">Commission</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50/70 cursor-pointer transition-colors"
                    onClick={() => openLead(lead.id)}
                  >
                    <Td className="whitespace-nowrap text-gray-500">
                      {formatDate(lead.created_at)}
                    </Td>
                    <Td>
                      <p className="font-semibold text-gray-900">
                        {lead.first_name} {lead.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </Td>
                    <Td className="text-gray-600 max-w-[220px]">
                      <p className="truncate">{lead.street_address || '—'}</p>
                      <p className="text-xs text-gray-400 truncate">{lead.suburb || ''}</p>
                    </Td>
                    <Td className="text-gray-600">{lead.spotter?.full_name ?? '—'}</Td>
                    <Td>
                      {lead.agent ? (
                        <>
                          <p className="text-gray-900">{lead.agent.full_name}</p>
                          <p className="text-xs text-gray-500">
                            {lead.assigned_agency?.name ?? lead.agent.agency_name ?? ''}
                          </p>
                        </>
                      ) : lead.assigned_agency ? (
                        <>
                          <p className="text-gray-900">{lead.assigned_agency.name}</p>
                          <p className="text-xs text-[#B45309] font-semibold">No agent yet</p>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-[#B45309]">Unassigned</span>
                      )}
                    </Td>
                    <Td>
                      <Badge status={lead.status} label={lead.status_display} />
                    </Td>
                    <Td className="text-right tabular-nums text-gray-900">
                      {lead.agreed_commission_amount
                        ? formatMoney(lead.agreed_commission_amount)
                        : '—'}
                    </Td>
                    <Td className="text-right">
                      <span className="text-[#225AE3] font-semibold text-xs whitespace-nowrap">
                        Manage →
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination page={page} pageSize={PAGE_SIZE} total={count} onChange={setPage} />
          </>
        )}
      </Card>

      {selectedId !== null && (
        <LeadDetailPanel
          leadId={selectedId}
          agents={agents}
          agencies={agencies}
          onClose={closeLead}
          onChanged={handleChanged}
          onDeleted={handleDeleted}
          notify={push}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default AdminLeads;
