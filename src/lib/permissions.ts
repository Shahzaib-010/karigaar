"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import type { RoleName } from "@/src/lib/api";

/**
 * Map the backend's `redirect_to` hint onto a real app path.
 *
 * The API returns "/dashboard" (client), "/admin/dashboard" (admin) or
 * "/superadmin/dashboard" (superadmin). We run a single admin panel, so admin
 * AND superadmin both land on /admin/dashboard; clients go to the site home
 * for now (the client area isn't built yet). All paths are locale-prefixed.
 */
export function resolveRedirectPath(
  redirectTo: string | null | undefined,
  locale: string,
): string {
  const target = redirectTo ?? "";
  if (target.includes("admin")) {
    return `/${locale}/admin/dashboard`;
  }
  return `/${locale}`;
}

/** Convenience wrapper over useAuth for permission/role checks in the UI. */
export function usePermissions() {
  const { can, hasRole, roles, permissions } = useAuth();

  return useMemo(
    () => ({
      can,
      hasRole,
      roles,
      permissions,
      canAny: (perms: string[]) => perms.some((p) => can(p)),
      canAll: (perms: string[]) => perms.every((p) => can(p)),
      isAdmin: hasRole("admin") || hasRole("superadmin"),
      isSuperadmin: hasRole("superadmin"),
    }),
    [can, hasRole, roles, permissions],
  );
}

export type { RoleName };
