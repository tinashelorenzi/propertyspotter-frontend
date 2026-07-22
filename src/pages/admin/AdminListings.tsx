import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminApi, formatDate, formatMoney } from '../../services/adminApi';
import type { AdminAgency, AdminListing, UserBrief } from '../../services/adminApi';
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
import ListingEditor from '../../components/admin/ListingEditor';
import { LISTING_STATUSES, PROPERTY_TYPES } from '../../components/admin/listingOptions';
import { useToasts } from '../../hooks/useToasts';

const PAGE_SIZE = 10;

const AdminListings = () => {
  const { toasts, push, dismiss } = useToasts();

  const [listings, setListings] = useState<AdminListing[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [agents, setAgents] = useState<UserBrief[]>([]);
  const [agencies, setAgencies] = useState<AdminAgency[]>([]);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [ordering, setOrdering] = useState('-created_at');

  // null = closed, 'new' = create, otherwise the listing id being edited
  const [editing, setEditing] = useState<string | 'new' | null>(null);

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
      listing_status: statusFilter || undefined,
      property_type: typeFilter || undefined,
      agency: agencyFilter || undefined,
      ordering,
    }),
    [page, search, statusFilter, typeFilter, agencyFilter, ordering]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.listListings(query);
      setListings(response.results ?? []);
      setCount(response.count ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load listings');
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

  const quickToggle = async (listing: AdminListing, field: 'is_featured' | 'is_active') => {
    try {
      await adminApi.updateListing(listing.id, { [field]: !listing[field] });
      setListings((current) =>
        current.map((item) =>
          item.id === listing.id ? { ...item, [field]: !listing[field] } : item
        )
      );
      push(
        field === 'is_featured'
          ? listing.is_featured
            ? 'Removed from featured'
            : 'Featured on the homepage'
          : listing.is_active
          ? 'Hidden from the site'
          : 'Visible on the site'
      );
    } catch (err) {
      push(err instanceof Error ? err.message : String(err), 'error');
    }
  };

  const pendingCount = listings.filter((l) => l.listing_status === 'pending').length;
  const hasFilters = Boolean(search || statusFilter || typeFilter || agencyFilter);

  const clearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setTypeFilter('');
    setAgencyFilter('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Property listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {count.toLocaleString()} listing{count === 1 ? '' : 's'}
            {pendingCount > 0 && ` · ${pendingCount} on this page awaiting approval`}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={load}>
            Refresh
          </Button>
          <Button onClick={() => setEditing('new')}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New listing
          </Button>
        </div>
      </div>

      <Card className="!p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          <div className="lg:col-span-2">
            <TextInput
              placeholder="Search title, suburb, agent…"
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
            <option value="">All statuses</option>
            {LISTING_STATUSES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All property types</option>
            {PROPERTY_TYPES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <div className="flex items-center gap-3">
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
          <LoadingBlock label="Loading listings…" />
        ) : listings.length === 0 ? (
          <EmptyState
            title="No listings found"
            message={
              hasFilters
                ? 'Nothing matches these filters.'
                : 'Create your first property listing to show it on the public site.'
            }
            action={
              hasFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button onClick={() => setEditing('new')}>Create a listing</Button>
              )
            }
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr className="bg-gray-50/70">
                  <Th>Property</Th>
                  <Th>Location</Th>
                  <Th sortKey="listing_price" activeSort={ordering} onSort={handleSort} className="text-right">
                    Price
                  </Th>
                  <Th>Agent / agency</Th>
                  <Th>Status</Th>
                  <Th sortKey="view_count" activeSort={ordering} onSort={handleSort} className="text-right">
                    Views
                  </Th>
                  <Th sortKey="created_at" activeSort={ordering} onSort={handleSort}>
                    Created
                  </Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50/70 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3">
                        {listing.primary_image_url ? (
                          <img
                            src={listing.primary_image_url}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[200px]">
                            {listing.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {listing.display_property_type} · {listing.bedrooms} bed ·{' '}
                            {listing.bathrooms} bath
                          </p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-gray-600">
                      <p className="truncate max-w-[160px]">{listing.suburb}</p>
                      <p className="text-xs text-gray-400">{listing.province_display}</p>
                    </Td>
                    <Td className="text-right tabular-nums font-semibold text-gray-900">
                      {formatMoney(listing.listing_price)}
                    </Td>
                    <Td className="text-gray-600">
                      <p className="truncate max-w-[150px]">{listing.agent_name ?? '—'}</p>
                      <p className="text-xs text-gray-400 truncate max-w-[150px]">
                        {listing.agency_name ?? 'Platform listing'}
                      </p>
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge status={listing.listing_status} label={listing.status_display} />
                        {listing.is_featured && (
                          <span className="text-[10px] font-bold text-[#B45309] uppercase tracking-wide">
                            Featured
                          </span>
                        )}
                        {!listing.is_active && listing.listing_status === 'approved' && (
                          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            Hidden
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td className="text-right tabular-nums text-gray-600">{listing.view_count}</Td>
                    <Td className="text-gray-500 whitespace-nowrap">
                      {formatDate(listing.created_at)}
                    </Td>
                    <Td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => quickToggle(listing, 'is_featured')}
                          title={listing.is_featured ? 'Remove from featured' : 'Feature this listing'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            listing.is_featured
                              ? 'text-[#F59E0B] hover:bg-[#F59E0B]/10'
                              : 'text-gray-300 hover:text-[#F59E0B] hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.365-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => quickToggle(listing, 'is_active')}
                          title={listing.is_active ? 'Hide from the site' : 'Show on the site'}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-[#225AE3] hover:bg-gray-100 transition-colors"
                        >
                          {listing.is_active ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          )}
                        </button>
                        <Button size="sm" variant="secondary" onClick={() => setEditing(listing.id)}>
                          Edit
                        </Button>
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

      {editing !== null && (
        <ListingEditor
          listingId={editing === 'new' ? null : editing}
          agents={agents}
          onClose={() => setEditing(null)}
          onSaved={load}
          notify={push}
        />
      )}

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </div>
  );
};

export default AdminListings;
