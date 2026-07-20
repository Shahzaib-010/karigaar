"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/src/lib/permissions";

/**
 * Client-side gate for the worker portal. Waits for the boot-time /me
 * rehydrate, then bounces anyone who isn't an authenticated worker. Server-side
 * enforcement still lives in the API (every endpoint is permission gated).
 */
export default function WorkerGuard({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const { isWorker } = usePermissions();
  const router = useRouter();

  const allowed = isAuthenticated && isWorker;
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading || allowed || redirectedRef.current) return;
    redirectedRef.current = true;
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`);
    } else {
      router.replace(`/${locale}`);
    }
  }, [isLoading, isAuthenticated, allowed, locale, router]);

  if (isLoading || !allowed) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
