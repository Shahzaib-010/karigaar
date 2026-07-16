"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/src/lib/permissions";

/**
 * Client-side gate for the admin panel. Waits for the boot-time /me rehydrate
 * (isLoading), then bounces anyone who isn't an authenticated admin/superadmin.
 * Server-side enforcement still lives in the API (every endpoint is permission
 * gated) — this is purely for UX.
 */
export default function AdminGuard({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const { isAdmin } = usePermissions();
  const router = useRouter();

  const allowed = isAuthenticated && isAdmin;
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading || allowed || redirectedRef.current) return;
    redirectedRef.current = true;
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    } else {
      router.replace(`/${locale}`);
    }
  }, [isLoading, isAuthenticated, isAdmin, allowed, locale, router]);

  if (isLoading || !allowed) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
