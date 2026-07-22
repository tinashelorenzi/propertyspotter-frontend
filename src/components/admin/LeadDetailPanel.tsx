import { useCallback, useEffect, useState } from 'react';
import {
  adminApi,
  formatDateTime,
  formatMoneyPrecise,
  formatRelative,
} from '../../services/adminApi';
import type { AdminAgency, AdminLead, UserBrief } from '../../services/adminApi';
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  Field,
  LoadingBlock,
  Modal,
  Select,
  TextArea,
  TextInput,
} from './ui';

const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
];

type Tab = 'details' | 'assign' | 'notes' | 'history';

interface Props {
  leadId: number;
  agents: UserBrief[];
  agencies: AdminAgency[];
  onClose: () => void;
  onChanged: (lead: AdminLead) => void;
  onDeleted: (leadId: number) => void;
  notify: (message: string, type?: 'success' | 'error') => void;
}

const LeadDetailPanel = ({
  leadId,
  agents,
  agencies,
  onClose,
  onChanged,
  onDeleted,
  notify,
}: Props) => {
  const [lead, setLead] = useState<AdminLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>('details');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit form
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    street_address: '',
    suburb: '',
    preferred_agent: '',
    notes_text: '',
    agreed_commission_amount: '',
  });

  // Assignment form
  const [agentId, setAgentId] = useState('');
  const [agencyId, setAgencyId] = useState('');
  const [assignNote, setAssignNote] = useState('');
  const [notifyOnAssign, setNotifyOnAssign] = useState(true);

  // Reject form
  const [rejectReason, setRejectReason] = useState('');
  const [notifyOnReject, setNotifyOnReject] = useState(false);
  const [showReject, setShowReject] = useState(false);

  // Notes
  const [newNote, setNewNote] = useState('');

  const applyLead = useCallback((next: AdminLead) => {
    setLead(next);
    setForm({
      first_name: next.first_name ?? '',
      last_name: next.last_name ?? '',
      email: next.email ?? '',
      phone: next.phone ?? '',
      street_address: next.street_address ?? '',
      suburb: next.suburb ?? '',
      preferred_agent: next.preferred_agent ?? '',
      notes_text: next.notes_text ?? '',
      agreed_commission_amount: next.agreed_commission_amount ?? '',
    });
    setAgentId(next.agent?.id ?? '');
    setAgencyId(next.assigned_agency?.id ?? '');
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      applyLead(await adminApi.getLead(leadId));
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Could not load the lead', 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [leadId, applyLead, notify, onClose]);

  useEffect(() => {
    load();
  }, [load]);

  const commit = (next: AdminLead, message: string) => {
    applyLead(next);
    onChanged(next);
    notify(message);
  };

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (err) {
      notify(err instanceof Error ? err.message : 'The action failed', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () =>
    run(async () => {
      const payload: Record<string, unknown> = { ...form };
      payload.agreed_commission_amount =
        form.agreed_commission_amount === '' ? null : form.agreed_commission_amount;
      const result = await adminApi.updateLead(leadId, payload);
      commit(result.lead, 'Lead updated');
    });

  const handleAssignAgent = () =>
    run(async () => {
      if (!agentId) {
        notify('Pick an agent first', 'error');
        return;
      }
      const result = await adminApi.assignLeadToAgent(leadId, {
        agent_id: agentId,
        note: assignNote,
        notify: notifyOnAssign,
      });
      setAssignNote('');
      commit(result.lead, result.message);
    });

  const handleAssignAgency = () =>
    run(async () => {
      if (!agencyId) {
        notify('Pick an agency first', 'error');
        return;
      }
      const result = await adminApi.assignLeadToAgency(leadId, {
        agency_id: agencyId,
        note: assignNote,
        notify: notifyOnAssign,
      });
      setAssignNote('');
      commit(result.lead, result.message);
    });

  const handleReject = () =>
    run(async () => {
      if (!rejectReason.trim()) {
        notify('A reason is required', 'error');
        return;
      }
      const result = await adminApi.rejectLead(leadId, {
        reason: rejectReason.trim(),
        notify: notifyOnReject,
      });
      setShowReject(false);
      setRejectReason('');
      commit(result.lead, 'Lead rejected');
    });

  const handleStatus = (status: string) =>
    run(async () => {
      const result = await adminApi.setLeadStatus(leadId, { status });
      commit(result.lead, result.message);
    });

  const handleAddNote = () =>
    run(async () => {
      if (!newNote.trim()) return;
      await adminApi.addLeadNote(leadId, newNote.trim());
      setNewNote('');
      const refreshed = await adminApi.getLead(leadId);
      applyLead(refreshed);
      onChanged(refreshed);
      notify('Note added');
    });

  const handleDeleteNote = (noteId: number) =>
    run(async () => {
      await adminApi.deleteLeadNote(leadId, noteId);
      const refreshed = await adminApi.getLead(leadId);
      applyLead(refreshed);
      notify('Note deleted');
    });

  const handleDelete = () =>
    run(async () => {
      await adminApi.deleteLead(leadId);
      setConfirmDelete(false);
      onDeleted(leadId);
      notify('Lead deleted');
      onClose();
    });

  const agentsForAgency = agencyId
    ? agents.filter((agent) => agent.agency === agencyId)
    : agents;

  const tabs: Array<{ key: Tab; label: string; count?: number }> = [
    { key: 'details', label: 'Details' },
    { key: 'assign', label: 'Routing' },
    { key: 'notes', label: 'Notes', count: lead?.notes?.length ?? lead?.note_count },
    { key: 'history', label: 'Timeline' },
  ];

  return (
    <>
      <Modal
        open
        onClose={onClose}
        size="lg"
        title={loading ? 'Loading lead…' : `${lead?.first_name} ${lead?.last_name}`}
        subtitle={
          lead
            ? [lead.street_address, lead.suburb].filter(Boolean).join(', ') ||
              'No address supplied'
            : undefined
        }
        footer={
          lead && (
            <>
              <Button variant="ghost" onClick={() => setConfirmDelete(true)} disabled={busy}>
                Delete lead
              </Button>
              <div className="flex-1" />
              <Button variant="secondary" onClick={onClose} disabled={busy}>
                Close
              </Button>
              {tab === 'details' && (
                <Button onClick={handleSave} disabled={busy}>
                  {busy ? 'Saving…' : 'Save changes'}
                </Button>
              )}
            </>
          )
        }
      >
        {loading || !lead ? (
          <LoadingBlock />
        ) : (
          <div className="space-y-5">
            {/* Status strip + quick actions */}
            <div className="flex flex-wrap items-center gap-3 pb-5 border-b border-gray-200">
              <Badge status={lead.status} label={lead.status_display} />
              {lead.agent ? (
                <span className="text-xs text-gray-600">
                  Agent: <strong className="text-gray-900">{lead.agent.full_name}</strong>
                </span>
              ) : (
                <span className="text-xs font-semibold text-[#B45309]">No agent assigned</span>
              )}
              {lead.assigned_agency && (
                <span className="text-xs text-gray-600">
                  Agency: <strong className="text-gray-900">{lead.assigned_agency.name}</strong>
                </span>
              )}
              <div className="flex-1" />
              {lead.status !== 'rejected' && (
                <Button variant="secondary" size="sm" onClick={() => setShowReject(true)} disabled={busy}>
                  Reject
                </Button>
              )}
              {lead.status === 'rejected' && (
                <Button variant="secondary" size="sm" onClick={() => handleStatus('new')} disabled={busy}>
                  Re-open
                </Button>
              )}
              {lead.status !== 'closed' && (
                <Button variant="secondary" size="sm" onClick={() => handleStatus('closed')} disabled={busy}>
                  Mark closed
                </Button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-gray-200 -mb-px">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                    tab === item.key
                      ? 'border-[#225AE3] text-[#225AE3]'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {item.label}
                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1.5 text-xs text-gray-400">{item.count}</span>
                  )}
                </button>
              ))}
            </div>

            {tab === 'details' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="First name">
                    <TextInput
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    />
                  </Field>
                  <Field label="Last name">
                    <TextInput
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    />
                  </Field>
                  <Field label="Phone">
                    <TextInput
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </Field>
                  <Field label="Email">
                    <TextInput
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </Field>
                  <Field label="Street address">
                    <TextInput
                      value={form.street_address}
                      onChange={(e) => setForm({ ...form, street_address: e.target.value })}
                    />
                  </Field>
                  <Field label="Suburb">
                    <TextInput
                      value={form.suburb}
                      onChange={(e) => setForm({ ...form, suburb: e.target.value })}
                    />
                  </Field>
                  <Field label="Preferred agent (spotter's request)">
                    <TextInput
                      value={form.preferred_agent}
                      onChange={(e) => setForm({ ...form, preferred_agent: e.target.value })}
                    />
                  </Field>
                  <Field
                    label="Agreed commission"
                    hint="Spotter earns 5%, platform keeps 2.5% — recalculated on save."
                  >
                    <TextInput
                      type="number"
                      step="0.01"
                      value={form.agreed_commission_amount}
                      onChange={(e) =>
                        setForm({ ...form, agreed_commission_amount: e.target.value })
                      }
                      placeholder="0.00"
                    />
                  </Field>
                </div>

                <Field label="Summary notes">
                  <TextArea
                    rows={3}
                    value={form.notes_text}
                    onChange={(e) => setForm({ ...form, notes_text: e.target.value })}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Spotter payout</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatMoneyPrecise(lead.spotter_commission_amount)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Platform fee</p>
                    <p className="text-sm font-bold text-gray-900">
                      {formatMoneyPrecise(lead.platform_fee)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">Submitted by</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {lead.spotter?.full_name ?? '—'}
                    </p>
                  </div>
                </div>

                {lead.images && lead.images.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Photos from the spotter
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {lead.images.map((image) => (
                        <a
                          key={image.id}
                          href={image.image_url ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-shrink-0"
                        >
                          <img
                            src={image.image_url ?? ''}
                            alt={image.description || 'Lead photo'}
                            className="w-28 h-28 object-cover rounded-xl border border-gray-200"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === 'assign' && (
              <div className="space-y-5 pt-2">
                <div className="rounded-xl border border-gray-200 p-4 space-y-3">
                  <p className="text-sm font-bold text-gray-900">Route to an agency</p>
                  <p className="text-xs text-gray-500">
                    Sends the lead to the agency inbox so they can pick an agent themselves.
                  </p>
                  <Field label="Agency">
                    <Select value={agencyId} onChange={(e) => setAgencyId(e.target.value)}>
                      <option value="">Select an agency…</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} ({agency.agent_count} agents)
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Button variant="secondary" onClick={handleAssignAgency} disabled={busy || !agencyId}>
                    Assign to agency
                  </Button>
                </div>

                <div className="rounded-xl border border-[#225AE3]/30 bg-[#225AE3]/5 p-4 space-y-3">
                  <p className="text-sm font-bold text-gray-900">Assign to an agent</p>
                  <p className="text-xs text-gray-500">
                    The agent is notified on WhatsApp and by email, and the spotter is told who
                    picked it up.
                  </p>
                  <Field label="Agent">
                    <Select value={agentId} onChange={(e) => setAgentId(e.target.value)}>
                      <option value="">Select an agent…</option>
                      {agentsForAgency.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.full_name} — {agent.agency_name ?? 'No agency'}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Note for the agent (optional)">
                    <TextArea
                      rows={2}
                      value={assignNote}
                      onChange={(e) => setAssignNote(e.target.value)}
                      placeholder="Anything the agent should know before calling…"
                    />
                  </Field>
                  <Checkbox
                    label="Notify by WhatsApp and email"
                    checked={notifyOnAssign}
                    onChange={setNotifyOnAssign}
                  />
                  <Button onClick={handleAssignAgent} disabled={busy || !agentId}>
                    {busy ? 'Assigning…' : 'Assign & notify'}
                  </Button>
                </div>

                <div className="rounded-xl border border-gray-200 p-4">
                  <p className="text-sm font-bold text-gray-900 mb-3">Move to a status</p>
                  <div className="flex flex-wrap gap-2">
                    {LEAD_STATUSES.map((status) => (
                      <Button
                        key={status.value}
                        size="sm"
                        variant={lead.status === status.value ? 'primary' : 'secondary'}
                        onClick={() => handleStatus(status.value)}
                        disabled={busy || lead.status === status.value}
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'notes' && (
              <div className="space-y-4 pt-2">
                <div className="rounded-xl border border-gray-200 p-4">
                  <Field label="Add a note">
                    <TextArea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Called the seller, they're open to a valuation next week…"
                    />
                  </Field>
                  <div className="mt-3">
                    <Button onClick={handleAddNote} disabled={busy || !newNote.trim()}>
                      Add note
                    </Button>
                  </div>
                </div>

                {(lead.notes ?? []).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">
                    No notes on this lead yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {(lead.notes ?? []).map((note) => (
                      <li key={note.id} className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-gray-800 whitespace-pre-wrap flex-1">
                            {note.content}
                          </p>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                            title="Delete note"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {note.created_by?.full_name ?? 'System'} · {formatRelative(note.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {tab === 'history' && (
              <dl className="pt-2 space-y-3">
                {[
                  ['Received', lead.created_at],
                  ['Last updated', lead.updated_at],
                  ['Assigned', lead.assigned_at],
                  ['Accepted by agent', lead.accepted_at],
                  ['Closed', lead.closed_at],
                ].map(([label, value]) => (
                  <div
                    key={label as string}
                    className="flex items-baseline justify-between gap-3 py-2 border-b border-gray-100"
                  >
                    <dt className="text-sm text-gray-600">{label}</dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {formatDateTime(value as string | null)}
                    </dd>
                  </div>
                ))}
                {(lead.commissions ?? []).length > 0 && (
                  <div className="pt-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                      Commission records
                    </p>
                    <ul className="space-y-2">
                      {(lead.commissions ?? []).map((commission) => (
                        <li
                          key={commission.id}
                          className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                        >
                          <Badge status={commission.status} />
                          <span className="text-sm text-gray-700">
                            Spotter {formatMoneyPrecise(commission.spotter_commission_amount)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {commission.payment_reference || 'no reference'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </dl>
            )}
          </div>
        )}
      </Modal>

      {/* Reject dialog */}
      <Modal
        open={showReject}
        onClose={() => setShowReject(false)}
        title="Reject this lead"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowReject(false)} disabled={busy}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleReject} disabled={busy || !rejectReason.trim()}>
              {busy ? 'Rejecting…' : 'Reject lead'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Reason" hint="Stored on the lead's timeline as a note.">
            <TextArea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Duplicate of lead #124 / seller not interested / outside our area…"
            />
          </Field>
          <Checkbox
            label="Email the spotter about the rejection"
            checked={notifyOnReject}
            onChange={setNotifyOnReject}
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this lead?"
        message="This permanently removes the lead, its notes and its photos. This cannot be undone — reject the lead instead if you just want it out of the pipeline."
        confirmLabel="Delete permanently"
        destructive
        busy={busy}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
};

export default LeadDetailPanel;
