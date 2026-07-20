"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import type { RoleName } from "@/src/lib/api";

/**
 * Map a logged-in user to their landing path.
 *
 * The backend's `redirect_to` only distinguishes client/admin/superadmin
 * ("/dashboard", "/admin/dashboard", "/superadmin/dashboard") — it has no
 * worker hint — so we resolve by ROLE, with `redirect_to` as a fallback:
 *   admin/superadmin → /admin/dashboard   (single combined panel)
 *   worker           → /worker/dashboard
 *   otherwise        → /services          (client browses + books)
 * All paths are locale-prefixed.
 */
/** Case-insensitive role check — the backend's role casing isn't guaranteed. */
function hasRoleName(roles: readonly RoleName[], name: string): boolean {
  return roles.some((r) => String(r).toLowerCase() === name);
}

/**
 * The dedicated portal path for a role, or null for clients (whose home is the
 * public site). Used to point admins/workers back to their dashboard from the
 * public site, so they never hit a dead end.
 */
export function roleDashboardPath(
  roles: readonly RoleName[],
  locale: string,
): string | null {
  if (hasRoleName(roles, "admin") || hasRoleName(roles, "superadmin")) {
    return `/${locale}/admin/dashboard`;
  }
  if (hasRoleName(roles, "worker")) return `/${locale}/worker/dashboard`;
  return null;
}

export function resolveRedirectPath(
  redirectTo: string | null | undefined,
  locale: string,
  roles: readonly RoleName[] = [],
): string {
  const target = (redirectTo ?? "").toLowerCase();
  if (target.includes("admin") || hasRoleName(roles, "admin") || hasRoleName(roles, "superadmin")) {
    return `/${locale}/admin/dashboard`;
  }
  if (hasRoleName(roles, "worker") || target.includes("worker")) {
    return `/${locale}/worker/dashboard`;
  }
  return `/${locale}/services`;
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
      isAdmin: hasRoleName(roles, "admin") || hasRoleName(roles, "superadmin"),
      isSuperadmin: hasRoleName(roles, "superadmin"),
      isWorker: hasRoleName(roles, "worker"),
    }),
    [can, hasRole, roles, permissions],
  );
}

export type { RoleName };
