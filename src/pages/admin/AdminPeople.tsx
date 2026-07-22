import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi, formatDate, formatRelative } from '../../services/adminApi';
import type { AdminAgency, AdminUser } from '../../services/adminApi';
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
  TableShell,
  Td,
  TextArea,
  TextInput,
  Th,
  ToastStack,
} from '../../components/admin/ui';
import { useToasts } from '../../hooks/useToasts';

const PAGE_SIZE = 10;

const ROLES = [
  { value: 'Spotter', label: 'Spotter' },
  { value: 'Agent', label: 'Agent' },
  { value: 'Agency_Admin', label: 'Agency Administrator' },
  { value: 'Master Agent', label: 'Master Agent' },
  { value: 'Admin', label: 'System Administrator' },
];

const emptyAgency = {
  name: '',
  email: '',
  phone: '',
  address: '',
  license_valid_until: '',
  is_active: true,
};

const AdminPeople = () => {
  const { toasts, push, dismiss } = useToasts();
  const [tab, setTab] = useState<'people' | 'agencies'>('people');

  // ---- Users ----
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'Spotter',
    agency: '',
    is_active: true,
  });

  // ---- Agencies ----
  const [agencies, setAgencies] = useState<AdminAgency[]>([]);
  const [agenciesLoading, setAgenciesLoading] = useState(true);
  const [editingAgency, setEditingAgency] = useState<AdminAgency | 'new' | null>(null);
  const [agencyForm, setAgencyForm] = useState({ ...emptyAgency });
  const [deleteAgency, setDeleteAgency] = useState<AdminAgency | null>(null);

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const userQuery = useMemo(
    () => ({
      page,
      search: search || undefined,
      role: roleFilter || undefined,
      is_active: activeFilter || undefined,
      ordering: '-created_at',
    }),
    [page, search, roleFilter, activeFilter]
  );

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await adminApi.listUsers(userQuery);
      setUsers(response.results ?? []);
      setUserCount(response.count ?? 0);
    } catch (err) {
      setUsersError(err instanceof Error ? err.message : 'Could not load users');
    } finally {
      setUsersLoading(false);
    }
  }, [userQuery]);

  const loadAgencies = useCallback(async () => {
    setAgenciesLoading(true);
    try {
      setAgencies(await adminApi.listAgencies());
    } catch (err) {
      push(err instanceof Error ? err.message : String(err), 'error');
    } finally {
      setAgenciesLoading(false);
    }
  }, [push]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadAgencies();
  }, [loadAgencies]);

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

  const openUser = (user: AdminUser) => {
    setEditingUser(user);
    setUserForm({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      role: user.role ?? 'Spotter',
      agency: user.agency ?? '',
      is_active: user.is_active,
    });
  };

  const handleSaveUser = () =>
    run(async () => {
      if (!editingUser) return;
      const result = await adminApi.updateUser(editingUser.id, {
        ...userForm,
        agency: userForm.agency || null,
      });
      push(result.message);
      setEditingUser(null);
      await loadUsers();
    });

  const toggleUserActive = (user: AdminUser) =>
    run(async () => {
      await adminApi.updateUser(user.id, { is_active: !user.is_active });
      setUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, is_active: !user.is_active } : item
        )
      );
      push(user.is_active ? 'Account deactivated' : 'Account reactivated');
    });

  const openAgency = (agency: AdminAgency | 'new') => {
    setEditingAgency(agency);
    if (agency === 'new') {
      setAgencyForm({ ...emptyAgency });
    } else {
      setAgencyForm({
        name: agency.name ?? '',
        email: agency.email ?? '',
        phone: agency.phone ?? '',
        address: agency.address ?? '',
        license_valid_until: agency.license_valid_until ?? '',
        is_active: agency.is_active,
      });
    }
  };

  const handleSaveAgency = () =>
    run(async () => {
      if (!agencyForm.name.trim() || !agencyForm.email.trim()) {
        push('A name and email are required', 'error');
        return;
      }
      const payload = {
        ...agencyForm,
        license_valid_until: agencyForm.license_valid_until || null,
      };

      if (editingAgency === 'new') {
        await adminApi.createAgency(payload);
        push('Agency created');
      } else if (editingAgency) {
        await adminApi.updateAgency(editingAgency.id, payload);
        push('Agency updated');
      }
      setEditingAgency(null);
      await loadAgencies();
    });

  const handleDeleteAgency = () =>
    run(async () => {
      if (!deleteAgency) return;
      await adminApi.deleteAgency(deleteAgency.id);
      push('Agency deleted');
      setDeleteAgency(null);
      await loadAgencies();
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">People & agencies</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {userCount.toLocaleString()} users across {agencies.length} agenc
            {agencies.length === 1 ? 'y' : 'ies'}
          </p>
        </div>
        {tab === 'agencies' && <Button onClick={() => openAgency('new')}>Add an agency</Button>}
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {(['people', 'agencies'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 capitalize transition-colors ${
              tab === key
                ? 'border-[#225AE3] text-[#225AE3]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {tab === 'people' ? (
        <>
          <Card className="!p-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <TextInput
                  placeholder="Search name, email, phone, agency…"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <Select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All roles</option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
              <Select
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">Active and inactive</option>
                <option value="true">Active only</option>
                <option value="false">Deactivated only</option>
              </Select>
            </div>
          </Card>

          {usersError && <ErrorBlock message={usersError} onRetry={loadUsers} />}

          <Card padded={false}>
            {usersLoading ? (
              <LoadingBlock label="Loading people…" />
            ) : users.length === 0 ? (
              <EmptyState title="No users found" message="Try widening your search." />
            ) : (
              <>
                <TableShell>
                  <thead>
                    <tr className="bg-gray-50/70">
                      <Th>Name</Th>
                      <Th>Contact</Th>
                      <Th>Role</Th>
                      <Th>Agency</Th>
                      <Th className="text-right">Leads</Th>
                      <Th>Joined</Th>
                      <Th>Last seen</Th>
                      <Th className="text-right">Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/70 transition-colors">
                        <Td>
                          <p className="font-semibold text-gray-900">{user.full_name}</p>
                          {!user.is_active && (
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                              Deactivated
                            </span>
                          )}
                        </Td>
                        <Td className="text-gray-600">
                          <p className="truncate max-w-[190px]">{user.email}</p>
                          <p className="text-xs text-gray-400">{user.phone ?? '—'}</p>
                        </Td>
                        <Td>
                          <Badge
                            status={user.role === 'Admin' ? 'approved' : 'draft'}
                            label={user.role.replace(/_/g, ' ')}
                          />
                        </Td>
                        <Td className="text-gray-600 truncate max-w-[150px]">
                          {user.agency_name ?? '—'}
                        </Td>
                        <Td className="text-right tabular-nums text-gray-700">
                          {user.lead_count}
                        </Td>
                        <Td className="text-gray-500 whitespace-nowrap">
                          {formatDate(user.created_at)}
                        </Td>
                        <Td className="text-gray-500 whitespace-nowrap">
                          {user.last_login ? formatRelative(user.last_login) : 'never'}
                        </Td>
                        <Td>
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="secondary" onClick={() => openUser(user)}>
                              Edit
                            </Button>
                            <button
                              onClick={() => toggleUserActive(user)}
                              className={`text-xs font-semibold ${
                                user.is_active
                                  ? 'text-gray-400 hover:text-red-600'
                                  : 'text-emerald-600 hover:text-emerald-700'
                              }`}
                            >
                              {user.is_active ? 'Deactivate' : 'Reactivate'}
                            </button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
                <Pagination page={page} pageSize={PAGE_SIZE} total={userCount} onChange={setPage} />
              </>
            )}
          </Card>
        </>
      ) : (
        <Card padded={false}>
          {agenciesLoading ? (
            <LoadingBlock label="Loading agencies…" />
          ) : agencies.length === 0 ? (
            <EmptyState
              title="No agencies yet"
              message="Onboard your first agency so leads can be routed to them."
              action={<Button onClick={() => openAgency('new')}>Add an agency</Button>}
            />
          ) : (
            <TableShell>
              <thead>
                <tr className="bg-gray-50/70">
                  <Th>Agency</Th>
                  <Th>Contact</Th>
                  <Th className="text-right">Agents</Th>
                  <Th className="text-right">Leads</Th>
                  <Th className="text-right">Listings</Th>
                  <Th>Licence</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-gray-50/70 transition-colors">
                    <Td>
                      <p className="font-semibold text-gray-900">{agency.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[220px]">
                        {agency.address ?? '—'}
                      </p>
                    </Td>
                    <Td className="text-gray-600">
                      <p className="truncate max-w-[190px]">{agency.email}</p>
                      <p className="text-xs text-gray-400">{agency.phone ?? '—'}</p>
                    </Td>
                    <Td className="text-right tabular-nums">{agency.agent_count}</Td>
                    <Td className="text-right tabular-nums">{agency.lead_count}</Td>
                    <Td className="text-right tabular-nums">{agency.listing_count}</Td>
                    <Td className="text-gray-500 whitespace-nowrap">
                      {agency.license_valid_until ? formatDate(agency.license_valid_until) : '—'}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => openAgency(agency)}>
                          Edit
                        </Button>
                        <button
                          onClick={() => setDeleteAgency(agency)}
                          className="text-xs font-semibold text-gray-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </Card>
      )}

      {/* Edit user */}
      <Modal
        open={editingUser !== null}
        onClose={() => setEditingUser(null)}
        title={editingUser?.full_name ?? 'Edit user'}
        subtitle={editingUser?.email}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingUser(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser} disabled={busy}>
              {busy ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First name">
            <TextInput
              value={userForm.first_name}
              onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
            />
          </Field>
          <Field label="Last name">
            <TextInput
              value={userForm.last_name}
              onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={userForm.phone}
              onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
            />
          </Field>
          <Field label="Role">
            <Select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
            >
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Agency">
            <Select
              value={userForm.agency}
              onChange={(e) => setUserForm({ ...userForm, agency: e.target.value })}
            >
              <option value="">No agency</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2 pt-1">
            <Checkbox
              label="Account is active"
              checked={userForm.is_active}
              onChange={(v) => setUserForm({ ...userForm, is_active: v })}
            />
          </div>

          {editingUser && (editingUser.bank_name || editingUser.account_number) && (
            <div className="sm:col-span-2 rounded-xl bg-gray-50 p-4">
              <SectionHeader title="Banking details on file" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p className="text-gray-600">
                  Bank: <span className="text-gray-900">{editingUser.bank_name ?? '—'}</span>
                </p>
                <p className="text-gray-600">
                  Branch:{' '}
                  <span className="text-gray-900">{editingUser.bank_branch_code ?? '—'}</span>
                </p>
                <p className="text-gray-600">
                  Account:{' '}
                  <span className="text-gray-900">{editingUser.account_number ?? '—'}</span>
                </p>
                <p className="text-gray-600">
                  Type: <span className="text-gray-900">{editingUser.account_type ?? '—'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Agency editor */}
      <Modal
        open={editingAgency !== null}
        onClose={() => setEditingAgency(null)}
        title={editingAgency === 'new' ? 'Add an agency' : 'Edit agency'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingAgency(null)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleSaveAgency} disabled={busy}>
              {busy ? 'Saving…' : editingAgency === 'new' ? 'Create agency' : 'Save changes'}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Agency name" className="sm:col-span-2">
            <TextInput
              value={agencyForm.name}
              onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
            />
          </Field>
          <Field label="Email" hint="Lead routing notifications go here.">
            <TextInput
              type="email"
              value={agencyForm.email}
              onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={agencyForm.phone}
              onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <TextArea
              rows={2}
              value={agencyForm.address}
              onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
            />
          </Field>
          <Field label="Licence valid until">
            <TextInput
              type="date"
              value={agencyForm.license_valid_until}
              onChange={(e) =>
                setAgencyForm({ ...agencyForm, license_valid_until: e.target.value })
              }
            />
          </Field>
          <div className="flex items-end pb-2">
            <Checkbox
              label="Agency is active"
              checked={agencyForm.is_active}
              onChange={(v) => setAgencyForm({ ...agencyForm, is_active: v })}
            />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteAgency !== null}
        title={`Delete ${deleteAgency?.name ?? 'this agency'}?`}
        message="Agencies with users attached cannot be deleted — move or deactivate them first."
        confirmLabel="Delete agency"
        destructive
        busy={busy}
        onConfirm={handleDeleteAgency}
        onCancel={() => setDeleteAgency(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default AdminPeople;
