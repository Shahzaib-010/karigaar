"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRightIcon, LayoutDashboardIcon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { roleDashboardPath } from "@/src/lib/permissions";

/**
 * Slim prompt shown to signed-in admins/workers while they're on the public
 * site, pointing them back to their portal so browsing the site is never a dead
 * end. Clients see nothing (the site is their home).
 */
export default function PortalBanner() {
  const locale = useLocale();
  const { isAuthenticated, user } = useAuth();

  const href = roleDashboardPath(user?.roles ?? [], locale);
  if (!isAuthenticated || !href) return null;

  const isAdmin = href.includes("/admin/");
  const label = isAdmin ? "admin" : "worker";

  return (
    <div className="border-b border-primary/15 bg-primary/5">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <LayoutDashboardIcon className="size-4 shrink-0 text-primary" />
          You&apos;re signed in as {label}. Manage your work from your dashboard.
        </p>
        <Link
          href={href}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
        >
          Go to dashboard
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
