import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminApi,
  formatDate,
  formatMoney,
  formatRelative,
  monthLabel,
} from '../../services/adminApi';
import type { DashboardOverview } from '../../services/adminApi';
import {
  Badge,
  Card,
  ErrorBlock,
  LoadingBlock,
  SectionHeader,
  StatTile,
} from '../../components/admin/ui';
import { GroupedBarChart, HorizontalBars, ProportionBar, SERIES } from '../../components/admin/charts';

const LEAD_STAGE_ORDER = ['new', 'assigned', 'accepted', 'in_progress', 'closed', 'rejected'];

const icons = {
  leads: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  money: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const AdminOverview = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await adminApi.overview());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingBlock label="Building your dashboard…" />;
  if (error) return <ErrorBlock message={error} onRetry={load} />;
  if (!data) return null;

  const monthOverMonth =
    data.leads.last_month > 0
      ? Math.round(
          ((data.leads.this_month - data.leads.last_month) / data.leads.last_month) * 100
        )
      : 0;

  const trendData = data.lead_trend.map((point) => ({
    label: monthLabel(point.month),
    fullLabel: point.month,
    values: [point.total, point.closed],
  }));

  const stageItems = LEAD_STAGE_ORDER.filter(
    (stage) => (data.leads.by_status[stage] ?? 0) > 0
  ).map((stage) => ({
    key: stage,
    label: stage.replace(/_/g, ' '),
    value: data.leads.by_status[stage] ?? 0,
  }));

  const listingSegments = [
    { key: 'approved', label: 'Live', value: data.listings.by_status.approved ?? 0, color: SERIES.green },
    { key: 'pending', label: 'Pending approval', value: data.listings.by_status.pending ?? 0, color: SERIES.accent },
    { key: 'draft', label: 'Draft', value: data.listings.by_status.draft ?? 0, color: SERIES.primary },
    { key: 'rejected', label: 'Rejected', value: data.listings.by_status.rejected ?? 0, color: '#9CA3AF' },
    { key: 'archived', label: 'Archived', value: data.listings.by_status.archived ?? 0, color: '#D1D5DB' },
  ];

  return (
    <div className="space-y-8">
      {/* Headline numbers */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Overview</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Updated {formatRelative(data.generated_at)}
            </p>
          </div>
          <button
            onClick={load}
            className="text-sm font-semibold text-[#225AE3] hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            label="Total leads"
            value={data.leads.total.toLocaleString()}
            trend={{ value: monthOverMonth, label: 'vs last month' }}
            hint={`${data.leads.this_month} this month`}
            icon={icons.leads}
            tone="blue"
            onClick={() => navigate('/admin/leads')}
          />
          <StatTile
            label="Needs attention"
            value={data.leads.unassigned.toLocaleString()}
            hint={`${data.leads.awaiting_acceptance} awaiting agent acceptance`}
            icon={icons.clock}
            tone="amber"
            onClick={() => navigate('/admin/leads?unassigned=true')}
          />
          <StatTile
            label="Live listings"
            value={data.listings.live.toLocaleString()}
            hint={`${data.listings.pending_approval} pending approval`}
            icon={icons.home}
            tone="green"
            onClick={() => navigate('/admin/listings')}
          />
          <StatTile
            label="Owed to spotters"
            value={formatMoney(data.commissions.outstanding_amount)}
            hint={`${data.commissions.outstanding_count} payment(s) queued`}
            icon={icons.money}
            tone="amber"
            onClick={() => navigate('/admin/commissions')}
          />
        </div>
      </div>

      {/* Trend + pipeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <SectionHeader
            title="Lead volume over the last 12 months"
            subtitle={`Conversion rate ${data.leads.conversion_rate}% · ${data.leads.last_30_days} leads in the last 30 days`}
          />
          <GroupedBarChart
            data={trendData}
            series={[
              { name: 'Leads received', color: SERIES.primary },
              { name: 'Leads closed', color: SERIES.accent },
            ]}
          />
        </Card>

        <Card>
          <SectionHeader title="Pipeline by stage" subtitle="Every lead, by where it sits" />
          <HorizontalBars items={stageItems} emptyLabel="No leads submitted yet" />
        </Card>
      </div>

      {/* Money + listings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <SectionHeader title="Commission ledger" />
          <dl className="space-y-4">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-gray-600">Total commission handled</dt>
              <dd className="text-lg font-bold text-gray-900 tabular-nums">
                {formatMoney(data.commissions.total_commission)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-gray-600">Paid to spotters</dt>
              <dd className="text-lg font-bold text-emerald-700 tabular-nums">
                {formatMoney(data.commissions.paid_amount)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-gray-600">Awaiting payment</dt>
              <dd className="text-lg font-bold text-[#B45309] tabular-nums">
                {formatMoney(data.commissions.outstanding_amount)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 pt-3 border-t border-gray-100">
              <dt className="text-sm text-gray-600">Platform fees earned</dt>
              <dd className="text-lg font-bold text-gray-900 tabular-nums">
                {formatMoney(data.commissions.platform_fees)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-gray-600">Agreed but unbilled (pipeline)</dt>
              <dd className="text-lg font-bold text-gray-900 tabular-nums">
                {formatMoney(data.commissions.pipeline_value)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <SectionHeader
            title="Listing catalogue"
            subtitle={`${data.listings.total} listings · ${data.listings.total_views.toLocaleString()} views`}
          />
          <ProportionBar segments={listingSegments} />
        </Card>

        <Card>
          <SectionHeader
            title="Community"
            subtitle={`${data.people.active_agencies} of ${data.people.agencies} agencies active`}
          />
          <HorizontalBars
            items={Object.entries(data.people.by_role).map(([role, count]) => ({
              key: role,
              label: role.replace(/_/g, ' '),
              value: count,
            }))}
            color={SERIES.purple}
            emptyLabel="No users yet"
          />
        </Card>
      </div>

      {/* League tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="Busiest agencies" subtitle="By leads routed to them" />
          <HorizontalBars
            items={data.top_agencies.map((agency) => ({
              key: agency.id,
              label: agency.name,
              value: agency.lead_count,
              sublabel: `${agency.closed_count} closed`,
            }))}
            emptyLabel="No agency has been assigned a lead yet"
          />
        </Card>

        <Card>
          <SectionHeader title="Top spotters" subtitle="By leads submitted" />
          <HorizontalBars
            items={data.top_spotters.map((spotter) => ({
              key: spotter.id,
              label: spotter.name,
              value: spotter.lead_count,
              sublabel: `${spotter.closed_count} closed · ${formatMoney(spotter.earned)} earned`,
            }))}
            color={SERIES.green}
            emptyLabel="No spotter has submitted a lead yet"
          />
        </Card>
      </div>

      {/* Recent activity */}
      <Card padded={false}>
        <div className="px-6 pt-6">
          <SectionHeader
            title="Latest leads"
            subtitle="Newest submissions across the platform"
            action={
              <button
                onClick={() => navigate('/admin/leads')}
                className="text-sm font-semibold text-[#225AE3] hover:underline"
              >
                View all leads
              </button>
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-6 py-3">Lead</th>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3">Property</th>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3">Spotter</th>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3">Agent</th>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3">Status</th>
                <th className="text-left text-xs font-bold uppercase tracking-wide text-gray-500 px-4 py-3">Received</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                    No leads have been submitted yet.
                  </td>
                </tr>
              )}
              {data.recent_leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50/70 cursor-pointer"
                  onClick={() => navigate(`/admin/leads?lead=${lead.id}`)}
                >
                  <td className="px-6 py-3 border-t border-gray-100 font-semibold text-gray-900">
                    {lead.name}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-100 text-gray-600">
                    {[lead.street_address, lead.suburb].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-100 text-gray-600">
                    {lead.spotter_name ?? '—'}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-100 text-gray-600">
                    {lead.agent_name ?? (
                      <span className="text-[#B45309] font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 border-t border-gray-100">
                    <Badge status={lead.status} />
                  </td>
                  <td className="px-4 py-3 border-t border-gray-100 text-gray-500 whitespace-nowrap">
                    {formatDate(lead.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverview;
