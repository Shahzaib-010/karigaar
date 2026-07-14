// Shared client for the Kaarigaar Laravel API.
//
// Endpoints (see the Postman collection in ./kariigar-api at the repo root):
//   POST /register     { name, email, password, password_confirmation } -> { message }  (emails an OTP)
//   POST /verify-otp   { email, otp }                                    -> { message }
//   POST /resend-otp   { email }                                         -> { message }
//   POST /login        { email, password }                              -> { access_token, token_type }
//   GET  /user         (Bearer token)                                    -> ApiUser
//
// Note: /login does NOT return the user; fetch it separately via /user.

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
  method?: "GET" | "POST" | "PUT" | "DELETE";
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

// ---- Domain types ---------------------------------------------------------

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_verified: boolean;
  phone_number: string | null;
  address: string | null;
  map_locate: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface MessageResponse {
  message: string;
}

// ---- Auth calls -----------------------------------------------------------

export function registerUser(input: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  return apiFetch<MessageResponse>("/register", { method: "POST", body: input });
}

export function verifyOtp(input: { email: string; otp: number }) {
  return apiFetch<MessageResponse>("/verify-otp", { method: "POST", body: input });
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

export function fetchCurrentUser(token: string) {
  return apiFetch<ApiUser>("/user", { token });
}
