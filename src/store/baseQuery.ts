import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { apiFetch, ApiError, type ApiValidationErrors } from "@/src/lib/api";

export interface AppQueryError {
  status: number;
  message: string;
  errors?: ApiValidationErrors;
}

export interface AppQueryArgs {
  url: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

// Must match TOKEN_STORAGE_KEY in context/AuthContext.tsx.
const TOKEN_STORAGE_KEY = "karigaar_token";

/**
 * RTK Query base query that delegates to our shared apiFetch, so every request
 * shares the same base URL, JSON handling and ApiError translation. The bearer
 * token is read from localStorage (auth lives in AuthContext, not the store).
 */
export const appBaseQuery: BaseQueryFn<
  AppQueryArgs,
  unknown,
  AppQueryError
> = async (args) => {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem(TOKEN_STORAGE_KEY)
      : null;

  try {
    const data = await apiFetch(args.url, {
      method: args.method,
      body: args.body,
      token,
    });
    return { data };
  } catch (e) {
    if (e instanceof ApiError) {
      return {
        error: { status: e.status, message: e.message, errors: e.errors },
      };
    }
    return {
      error: {
        status: 0,
        message: e instanceof Error ? e.message : "Request failed",
      },
    };
  }
};
