"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import {
  BellIcon,
  BellOffIcon,
  CheckCheckIcon,
  ClipboardListIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/src/lib/format";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/src/store/adminApi";
import { livePolling } from "@/src/store/realtime";

// Admin bell — same /notifications feed, scoped by the server to the logged-in
// admin (new order placed, status changed, …). Polls + refetches on focus so a
// client's booking surfaces here without a manual refresh.
export default function AdminNotificationsBell() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetNotificationsQuery(undefined, livePolling);
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const items = data?.data ?? [];
  const unread = data?.unread_count ?? 0;

  // Toast any notification that appears after the first load (a client placing
  // an order, a status change, …). The first successful fetch just seeds the
  // "seen" set so we don't toast the backlog on mount.
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!data) return;
    if (seen.current === null) {
      seen.current = new Set(data.data.map((n) => n.id));
      return;
    }
    const fresh = data.data.filter((n) => !seen.current!.has(n.id));
    fresh.forEach((n) => seen.current!.add(n.id));
    // Newest first; cap so a burst can't stack a wall of toasts.
    fresh.slice(0, 3).forEach((n) => {
      toast(n.data.title ?? "New notification", {
        description: n.data.body,
        action: n.data.order_id
          ? {
              label: "View",
              onClick: () =>
                router.push(`/${locale}/admin/orders/${n.data.order_id}`),
            }
          : undefined,
      });
    });
  }, [data, locale, router]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggle() {
    const next = !open;
    setOpen(next);
    if (next) refetch();
  }

  function onItemClick(id: string, orderId?: number) {
    markRead(id);
    setOpen(false);
    if (orderId) router.push(`/${locale}/admin/orders/${orderId}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={toggle}
        className={cn(
          "relative flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          open && "bg-muted text-foreground",
        )}
      >
        <BellIcon className="size-5" />
        {unread > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_16px_48px_-12px_rgba(16,24,40,0.25)]">
          <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Notifications</span>
              {unread > 0 ? (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  {unread} new
                </span>
              ) : null}
            </div>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <CheckCheckIcon className="size-3.5" />
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-[26rem] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <BellOffIcon className="size-5" />
                </span>
                <p className="text-sm font-medium">You&apos;re all caught up</p>
                <p className="text-xs text-muted-foreground">
                  New order activity will show up here.
                </p>
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onItemClick(n.id, n.data.order_id)}
                  className={cn(
                    "group/notif flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-start transition-colors last:border-b-0 hover:bg-muted/50",
                    !n.read && "bg-primary/[0.04]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                      n.read
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <ClipboardListIcon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {n.data.title ?? "Notification"}
                    </p>
                    {n.data.body ? (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {n.data.body}
                      </p>
                    ) : null}
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      {formatDateTime(n.created_at)}
                    </p>
                  </div>
                  {!n.read ? (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
