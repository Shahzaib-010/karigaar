"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

/**
 * Auth gate for customer-only pages (booking, my bookings, profile).
 * Waits for the boot-time /me rehydrate, then sends signed-out visitors to
 * login with a `next` param so they return here after signing in.
 */
export default function ClientGuard({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    if (!redirectedRef.current) {
      redirectedRef.current = true;
      router.replace(`/${locale}/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, locale, pathname, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
