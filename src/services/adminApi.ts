// Typed client for the staff-portal API (/api/staff/*).
// Every endpoint here is gated on the caller having the 'Admin' role.

const API_BASE = import.meta.env.VITE_BACKEND_API;
const STAFF = `${API_BASE}api/staff/`;

/** The two login flows in this app store the token under different keys. */
export function getToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
}

export function getStoredUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isStaffUser(user: { role?: string } | null | undefined): boolean {
  return user?.role === 'Admin';
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** What each notification helper reports back after an admin action. */
export type NotificationReport = Record<string, { whatsapp: boolean; email: boolean }>;

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UserBrief {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: string;
  agency: string | null;
  agency_name: string | null;
  is_active: boolean;
  profile_image_url: string | null;
}

export interface AgencyBrief {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
}

export interface LeadNote {
  id: number;
  content: string;
  created_by: UserBrief | null;
  created_at: string;
}

export interface LeadImage {
  id: number;
  image_url: string | null;
  description: string;
  uploaded_at: string;
}

export interface AdminLead {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string;
  street_address: string | null;
  suburb: string | null;
  status: string;
  status_display: string;
  is_accepted: boolean;
  notes_text: string;
  preferred_agent: string;
  spotter: UserBrief | null;
  agent: UserBrief | null;
  assigned_agency: AgencyBrief | null;
  agreed_commission_amount: string | null;
  spotter_commission_amount: string | null;
  platform_fee: string | null;
  note_count: number;
  image_count: number;
  created_at: string;
  updated_at: string;
  assigned_at: string | null;
  accepted_at: string | null;
  closed_at: string | null;
  // detail-only
  images?: LeadImage[];
  notes?: LeadNote[];
  requested_agent?: UserBrief | null;
  property_details?: Record<string, unknown> | null;
  commissions?: Array<{
    id: number;
    status: string;
    total_commission_amount: string;
    spotter_commission_amount: string;
    payment_date: string | null;
    payment_reference: string;
  }>;
}

export interface ListingImage {
  id: number;
  image_url: string | null;
  alt_text: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface AdminListing {
  id: string;
  title: string;
  suburb: string;
  province: string;
  province_display: string;
  street_address: string;
  property_type: string;
  display_property_type: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  listing_price: string;
  listing_status: string;
  status_display: string;
  is_active: boolean;
  is_featured: boolean;
  is_pet_friendly: boolean;
  has_pool: boolean;
  primary_image_url: string | null;
  image_count: number;
  agent: string | null;
  agent_name: string | null;
  agency_id: string | null;
  agency_name: string | null;
  submitted_by_name: string | null;
  rejection_reason: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  // detail-only
  description?: string;
  custom_property_type?: string;
  images?: ListingImage[];
  approved_by_name?: string | null;
  published_at?: string;
}

export interface AdminCommission {
  id: number;
  lead: number;
  lead_detail: {
    id: number;
    name: string;
    street_address: string | null;
    suburb: string | null;
    status: string;
    closed_at: string | null;
  };
  spotter: UserBrief | null;
  agent: UserBrief | null;
  agency: AgencyBrief | null;
  total_commission_amount: string;
  spotter_commission_amount: string;
  platform_fee: string | null;
  status: string;
  status_display: string;
  payment_date: string | null;
  payment_reference: string;
  payment_method: string;
  notes: string;
  approved_by_name: string | null;
  paid_by_name: string | null;
  spotter_banking: {
    bank_name: string | null;
    branch_code: string | null;
    account_number: string | null;
    account_name: string | null;
    account_type: string | null;
  } | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  paid_at: string | null;
}

export interface PayableLead {
  id: number;
  name: string;
  street_address: string | null;
  suburb: string | null;
  status: string;
  agreed_commission_amount: string | null;
  spotter_commission_amount: string | null;
  platform_fee: string | null;
  spotter: { id: string; name: string; email: string } | null;
  agent_name: string | null;
  agency_name: string | null;
  closed_at: string | null;
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string | null;
  role: string;
  agency: string | null;
  agency_name: string | null;
  is_active: boolean;
  profile_complete: boolean;
  profile_image_url: string | null;
  lead_count: number;
  bank_name: string | null;
  bank_branch_code: string | null;
  account_number: string | null;
  account_name: string | null;
  account_type: string | null;
  created_at: string;
  last_login: string | null;
}

export interface AdminAgency {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  license_valid_until: string | null;
  created_at: string;
  agent_count: number;
  lead_count: number;
  listing_count: number;
}

export interface DashboardOverview {
  generated_at: string;
  leads: {
    total: number;
    by_status: Record<string, number>;
    this_month: number;
    last_month: number;
    last_30_days: number;
    unassigned: number;
    awaiting_acceptance: number;
    conversion_rate: number;
  };
  listings: {
    total: number;
    by_status: Record<string, number>;
    pending_approval: number;
    live: number;
    featured: number;
    total_views: number;
  };
  commissions: {
    total_commission: string;
    spotter_payouts: string;
    platform_fees: string;
    outstanding_amount: string;
    outstanding_count: number;
    paid_amount: string;
    paid_count: number;
    pipeline_value: string;
  };
  people: {
    total: number;
    by_role: Record<string, number>;
    agencies: number;
    active_agencies: number;
  };
  lead_trend: Array<{ month: string; total: number; closed: number }>;
  top_agencies: Array<{ id: string; name: string; lead_count: number; closed_count: number }>;
  top_spotters: Array<{
    id: string;
    name: string;
    email: string;
    lead_count: number;
    closed_count: number;
    earned: string;
  }>;
  recent_leads: Array<{
    id: number;
    name: string;
    suburb: string | null;
    street_address: string | null;
    status: string;
    spotter_name: string | null;
    agent_name: string | null;
    agency_name: string | null;
    created_at: string;
  }>;
}

export interface CommissionSummary {
  totals: {
    total_commission: string;
    total_spotter_payouts: string;
    total_platform_fees: string;
  };
  by_status: Record<string, { label: string; count: number; amount: string }>;
  monthly_payouts: Array<{ month: string; amount: string; count: number }>;
  top_spotters: Array<{ id: string; name: string; email: string; amount: string; count: number }>;
}

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function extractMessage(payload: unknown, fallback: string): string {
  if (!payload) return fallback;
  if (typeof payload === 'string') return payload;
  if (typeof payload !== 'object') return fallback;

  const record = payload as Record<string, unknown>;
  if (typeof record.message === 'string') return record.message;
  if (typeof record.detail === 'string') return record.detail;

  // DRF field errors: { field: ["msg"] }
  const first = Object.entries(record)[0];
  if (first) {
    const [field, value] = first;
    const text = Array.isArray(value) ? value[0] : value;
    return `${field}: ${String(text)}`;
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit & { query?: Record<string, unknown> } = {}
): Promise<T> {
  const { query, headers, body, ...rest } = options;

  let url = path.startsWith('http') ? path : `${STAFF}${path}`;
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const qs = params.toString();
    if (qs) url += (url.includes('?') ? '&' : '?') + qs;
  }

  const isFormData = body instanceof FormData;
  const response = await fetch(url, {
    ...rest,
    body,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  let payload: unknown = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    throw new ApiError(
      extractMessage(payload, `Request failed (${response.status})`),
      response.status,
      payload
    );
  }

  return payload as T;
}

/** DRF returns either a paginated envelope or a bare list depending on the view. */
function toList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  const results = (payload as { results?: unknown } | null)?.results;
  return Array.isArray(results) ? (results as T[]) : [];
}

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

export interface StaffLoginResponse {
  token: string;
  user: AdminUser & { is_staff?: boolean; is_superuser?: boolean };
}

export const adminApi = {
  // ---- Authentication ----
  /**
   * Staff sign-in. Takes a username (not an email) like the Django admin login
   * it replaces, and refuses anyone without admin rights.
   */
  login: (credentials: { username: string; password: string; turnstileToken?: string }) =>
    fetch(`${STAFF}auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(async (response) => {
      const text = await response.text();
      let payload: unknown = null;
      try {
        payload = text ? JSON.parse(text) : null;
      } catch {
        payload = text;
      }
      if (!response.ok) {
        throw new ApiError(
          extractMessage(payload, 'Sign in failed'),
          response.status,
          payload
        );
      }
      return payload as StaffLoginResponse;
    }),

  session: () => request<{ user: AdminUser }>('auth/session/'),

  logout: () => request<{ message: string }>('auth/logout/', { method: 'POST', body: '{}' }),

  // ---- Dashboard ----
  overview: () => request<DashboardOverview>('dashboard/overview/'),

  // ---- Leads ----
  listLeads: (query: Record<string, unknown> = {}) =>
    request<Paginated<AdminLead>>('leads/', { query }),

  getLead: (id: number) => request<AdminLead>(`leads/${id}/`),

  updateLead: (id: number, data: Record<string, unknown>) =>
    request<{ lead: AdminLead; message: string }>(`leads/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteLead: (id: number) => request<{ message: string }>(`leads/${id}/`, { method: 'DELETE' }),

  assignLeadToAgent: (
    id: number,
    data: { agent_id: string; note?: string; notify?: boolean }
  ) =>
    request<{ lead: AdminLead; message: string; notifications: NotificationReport }>(
      `leads/${id}/assign-agent/`,
      { method: 'POST', body: JSON.stringify(data) }
    ),

  assignLeadToAgency: (
    id: number,
    data: { agency_id: string; note?: string; notify?: boolean; clear_agent?: boolean }
  ) =>
    request<{ lead: AdminLead; message: string; notifications: NotificationReport }>(
      `leads/${id}/assign-agency/`,
      { method: 'POST', body: JSON.stringify(data) }
    ),

  rejectLead: (id: number, data: { reason: string; notify?: boolean }) =>
    request<{ lead: AdminLead; message: string }>(`leads/${id}/reject/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  setLeadStatus: (id: number, data: { status: string; note?: string }) =>
    request<{ lead: AdminLead; message: string }>(`leads/${id}/status/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  listLeadNotes: (id: number) =>
    request<unknown>(`leads/${id}/notes/`).then((p) => toList<LeadNote>(p)),

  addLeadNote: (id: number, content: string) =>
    request<{ note: LeadNote }>(`leads/${id}/notes/`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  deleteLeadNote: (leadId: number, noteId: number) =>
    request<{ message: string }>(`leads/${leadId}/notes/${noteId}/`, { method: 'DELETE' }),

  // ---- Listings ----
  listListings: (query: Record<string, unknown> = {}) =>
    request<Paginated<AdminListing>>('listings/', { query }),

  getListing: (id: string) => request<AdminListing>(`listings/${id}/`),

  createListing: (data: Record<string, unknown>) =>
    request<{ listing: AdminListing; message: string }>('listings/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateListing: (id: string, data: Record<string, unknown>) =>
    request<{ listing: AdminListing; message: string }>(`listings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteListing: (id: string) =>
    request<{ message: string }>(`listings/${id}/`, { method: 'DELETE' }),

  decideListing: (
    id: string,
    data: { action: 'approve' | 'reject'; rejection_reason?: string; notify?: boolean }
  ) =>
    request<{ listing: AdminListing; message: string }>(`listings/${id}/approval/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  uploadListingImages: (id: string, files: File[], isPrimary = false) => {
    const form = new FormData();
    files.forEach((file) => form.append('images', file));
    if (isPrimary) form.append('is_primary', 'true');
    return request<{ images: ListingImage[]; message: string }>(`listings/${id}/images/`, {
      method: 'POST',
      body: form,
    });
  },

  deleteListingImage: (id: string, imageId: number) =>
    request<{ message: string }>(`listings/${id}/images/${imageId}/`, { method: 'DELETE' }),

  setListingCoverImage: (id: string, imageId: number) =>
    request<{ message: string }>(`listings/${id}/images/${imageId}/primary/`, { method: 'POST' }),

  reorderListingImages: (id: string, imageIds: number[]) =>
    request<{ images: ListingImage[] }>(`listings/${id}/images/reorder/`, {
      method: 'POST',
      body: JSON.stringify({ image_ids: imageIds }),
    }),

  // ---- Commissions ----
  listCommissions: (query: Record<string, unknown> = {}) =>
    request<Paginated<AdminCommission>>('commissions/', { query }),

  commissionSummary: () => request<CommissionSummary>('commissions/summary/'),

  payableLeads: () =>
    request<{ count: number; results: PayableLead[] }>('commissions/payable-leads/'),

  createCommission: (data: {
    lead_id: number;
    total_commission_amount?: string | number;
    spotter_commission_amount?: string | number;
    platform_fee?: string | number;
    notes?: string;
  }) =>
    request<{ commission: AdminCommission; message: string }>('commissions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCommission: (id: number, data: Record<string, unknown>) =>
    request<{ commission: AdminCommission; message: string }>(`commissions/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteCommission: (id: number) =>
    request<{ message: string }>(`commissions/${id}/`, { method: 'DELETE' }),

  approveCommission: (id: number) =>
    request<{ commission: AdminCommission; message: string }>(`commissions/${id}/approve/`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  payCommission: (
    id: number,
    data: {
      payment_reference?: string;
      payment_method?: string;
      payment_date?: string;
      notify?: boolean;
    }
  ) =>
    request<{ commission: AdminCommission; message: string }>(`commissions/${id}/pay/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  cancelCommission: (id: number, reason: string) =>
    request<{ commission: AdminCommission; message: string }>(`commissions/${id}/cancel/`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  // ---- People ----
  listUsers: (query: Record<string, unknown> = {}) =>
    request<Paginated<AdminUser>>('users/', { query }),

  updateUser: (id: string, data: Record<string, unknown>) =>
    request<{ user: AdminUser; message: string }>(`users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  listAgents: (query: Record<string, unknown> = {}) =>
    request<unknown>('agents/', { query }).then((p) => toList<UserBrief>(p)),

  listAgencies: (query: Record<string, unknown> = {}) =>
    request<unknown>('agencies/', { query }).then((p) => toList<AdminAgency>(p)),

  createAgency: (data: Record<string, unknown>) =>
    request<{ agency: AdminAgency; message: string }>('agencies/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateAgency: (id: string, data: Record<string, unknown>) =>
    request<{ agency: AdminAgency; message: string }>(`agencies/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteAgency: (id: string) =>
    request<{ message: string }>(`agencies/${id}/`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Formatting helpers shared across the admin screens
// ---------------------------------------------------------------------------

const CURRENCY = (import.meta.env.VITE_CURRENCY || 'R').replace(/"/g, '');

export function formatMoney(value: string | number | null | undefined): string {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return `${CURRENCY}0`;
  return `${CURRENCY}${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatMoneyPrecise(value: string | number | null | undefined): string {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) return `${CURRENCY}0.00`;
  return `${CURRENCY}${amount.toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-ZA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return '—';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(value);
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-ZA', { month: 'short' });
}
