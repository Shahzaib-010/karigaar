// Shared client for the Kaarigaar Laravel API (Sanctum bearer auth).
//
// See ./api-reference.html at the repo root for the full contract. Notes that
// shape this file:
//   - POST /login returns the token AND the user (with roles + permissions)
//     AND a redirect_to hint — no separate profile fetch needed after login.
//   - GET /me re-hydrates the current user (call on app boot / after role change).
//   - Responses come in THREE shapes: a bare array (categories), a { data }
//     envelope (most lists + /me), and a paginator object (/orders only).
//     Use the matching unwrap helper per call — see unwrapData / Paginated.

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://kaarigaar.chfarhanliaqat.site/api";

/** Laravel-style validation errors: { field: ["message", ...] } */
export type ApiValidationErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: ApiValidationErrors;

  constructor(message: string, status: number, errors?: ApiValidationErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type ApiFetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { method = "GET", body, token, signal } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const raw = await response.text();
  let data: unknown = null;
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }
  }

  if (!response.ok) {
    const record =
      typeof data === "object" && data !== null
        ? (data as Record<string, unknown>)
        : {};
    // NOTE: `message` may be Urdu (booking/review/slot rules). Show it as-is;
    // never pattern-match on it in English.
    const message =
      typeof record.message === "string"
        ? record.message
        : `Request failed (${response.status}).`;
    const errors =
      typeof record.errors === "object" && record.errors !== null
        ? (record.errors as ApiValidationErrors)
        : undefined;
    throw new ApiError(message, response.status, errors);
  }

  return data as T;
}

// ---- Response-shape helpers -----------------------------------------------

/** Most list/detail endpoints wrap payloads in `{ data: ... }`. */
export function unwrapData<T>(response: { data: T }): T {
  return response.data;
}

/** Laravel paginator — only `GET /orders` returns this shape. */
export interface Paginated<T> {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  data: T[];
  first_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  links?: unknown;
}

// ---- Domain types ---------------------------------------------------------

export type RoleName = "client" | "admin" | "superadmin" | (string & {});

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  address: string | null;
  map_locate: string | null;
  is_verified: boolean;
  roles: RoleName[];
  permissions: string[];
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  /** Backend routing hint: /dashboard | /admin/dashboard | /superadmin/dashboard */
  redirect_to: string;
  user: ApiUser;
}

export interface MessageResponse {
  message: string;
}

// ---- Dashboard ------------------------------------------------------------

export type OrderStatus =
  | "pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface CategoryRef {
  id: number;
  name: string;
}

export interface ClientRef {
  id: number;
  name: string;
  email?: string;
}

export interface WorkerRef {
  id: number;
  name: string;
}

export interface RecentOrder {
  id: number;
  status: OrderStatus | string;
  total_amount?: string;
  scheduled_at?: string | null;
  created_at?: string | null;
  client?: ClientRef | null;
  worker?: WorkerRef | null;
  category?: CategoryRef | null;
}

export interface TopCategory {
  category_id: number;
  total_orders: number;
  total_revenue: string;
  category?: CategoryRef | null;
}

export interface DashboardStats {
  overview: {
    total_users: number;
    total_workers: number;
    total_orders: number;
    total_revenue: string;
  };
  orders_by_status: Partial<Record<OrderStatus, number>>;
  workers_by_status: {
    available: number;
    busy: number;
    inactive: number;
  };
  revenue: {
    today: string;
    this_month: string;
    total: string;
  };
  recent_orders: RecentOrder[];
  top_categories: TopCategory[];
}

// ---- Orders ---------------------------------------------------------------

export interface SubCategoryRef {
  id: number;
  title: string;
}

export interface PriceCategoryRef {
  id: number;
  price: string;
  job_type?: string | null;
  duration?: string | null;
  complexity?: string | null;
}

export interface OrderClient extends ClientRef {
  phone_number?: string | null;
  address?: string | null;
}

/** Full order as returned by GET /orders (list) and GET /orders/{id}. */
export interface Order {
  id: number;
  status: OrderStatus | string;
  total_amount: string;
  scheduled_at?: string | null;
  address?: string | null;
  description?: string | null;
  client_notes?: string | null;
  admin_notes?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  client?: OrderClient | null;
  worker?: WorkerRef | null;
  category?: CategoryRef | null;
  sub_category?: SubCategoryRef | null;
  price_category?: PriceCategoryRef | null;
}

/** Worker record (admin managed). */
export interface Worker {
  id: number;
  name: string;
  phone?: string | null;
  email?: string | null;
  status?: "available" | "busy" | "inactive" | string;
  notes?: string | null;
  category?: CategoryRef | null;
  sub_category?: SubCategoryRef | null;
}

export interface OrdersQuery {
  page?: number;
  per_page?: number;
  status?: string;
  client?: string;
  from?: string;
  to?: string;
  category_id?: number;
}

export interface WorkerInput {
  name: string;
  phone: string;
  email?: string;
  category_id: number;
  sub_category_id?: number;
  status?: string;
  notes?: string;
}

export interface WorkersQuery {
  status?: string;
  category_id?: number;
}

// ---- Catalog --------------------------------------------------------------

export interface SubCategory {
  id: number;
  title: string;
  category_id?: number;
  description?: string | null;
  status?: boolean;
  category_pricings?: PriceCategoryRef[];
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  base_price?: string | null;
  status?: boolean;
  sub_categories?: SubCategory[];
}

/** Full price-category as returned by GET /price-categories (parent nested). */
export interface PriceCategory extends PriceCategoryRef {
  sub_category_id?: number;
  sub_category?: SubCategoryRef | null;
}

export interface CategoryInput {
  name: string;
  description?: string;
  base_price?: number;
  status?: boolean;
}

export interface SubCategoryInput {
  category_id: number;
  title: string;
  description?: string;
  status?: boolean;
}

export interface PriceCategoryInput {
  sub_category_id: number;
  price: number;
  job_type?: string;
  duration?: string;
  complexity?: string;
}

// ---- Roles, Permissions & Users -------------------------------------------

export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}

export interface RoleInput {
  name: string;
  permissions?: string[];
}

/** Roles that the backend refuses to rename/delete. */
export const PROTECTED_ROLES = ["client", "admin", "superadmin"] as const;

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  /** Backend may return role names as strings or { name } objects. */
  roles?: Array<string | { name: string }>;
  created_at?: string | null;
}

// ---- Client booking -------------------------------------------------------

/** A slot from GET /booking-slots/available (client picker). */
export interface AvailableSlot {
  id: number;
  time_from: string;
  time_to: string;
  max_bookings: number;
  booked_count: number;
  remaining: number;
  status: string;
}

export interface CreateOrderInput {
  price_category_id: number;
  booking_slot_id?: number;
  scheduled_at?: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  client_notes?: string;
}

// ---- Notifications --------------------------------------------------------

export interface AppNotification {
  id: string;
  data: {
    title?: string;
    body?: string;
    order_id?: number;
    type?: string;
  };
  read: boolean;
  created_at?: string | null;
}

export interface NotificationsResponse {
  data: AppNotification[];
  unread_count: number;
}

// ---- Reviews --------------------------------------------------------------

export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  order_id?: number;
  order?: { id: number; status?: string; scheduled_at?: string | null } | null;
  created_at?: string | null;
}

export interface ReviewInput {
  order_id: number;
  rating: number;
  comment?: string;
}

// ---- Booking Slots --------------------------------------------------------

export interface BookingSlot {
  id: number;
  date: string; // YYYY-MM-DD
  time_from: string; // HH:mm[:ss]
  time_to: string; // HH:mm[:ss]
  max_bookings: number;
  is_active?: boolean;
  booked_count?: number;
  remaining?: number;
  status?: string;
}

export interface BookingSlotInput {
  date: string;
  time_from: string;
  time_to: string;
  max_bookings?: number;
  is_active?: boolean;
}

export interface BookingSlotsQuery {
  date?: string;
  is_active?: boolean;
}

// ---- Auth calls -----------------------------------------------------------

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  address: string;
  map_locate?: string;
}) {
  return apiFetch<MessageResponse>("/register", { method: "POST", body: input });
}

export function verifyOtp(input: { email: string; otp: string }) {
  return apiFetch<MessageResponse>("/verify-otp", {
    method: "POST",
    body: input,
  });
}

export function resendOtp(email: string) {
  return apiFetch<MessageResponse>("/resend-otp", {
    method: "POST",
    body: { email },
  });
}

export function loginRequest(input: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/login", { method: "POST", body: input });
}

/** Current user's profile, roles and permissions. Wrapped in `{ data }`. */
export async function getMe(token: string) {
  const res = await apiFetch<{ data: ApiUser }>("/me", { token });
  return unwrapData(res);
}
