"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { BellIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDateTime } from "@/src/lib/format";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/src/store/clientApi";
import { livePolling } from "@/src/store/realtime";

export default function NotificationsBell() {
  const locale = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data, refetch } = useGetNotificationsQuery(undefined, livePolling);
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const [markRead] = useMarkNotificationReadMutation();

  const items = data?.data ?? [];
  const unread = data?.unread_count ?? 0;

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
    if (orderId) router.push(`/${locale}/bookings/${orderId}`);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={toggle}
        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <BellIcon className="size-5" />
        {unread > 0 ? (
          <span className="absolute right-1 top-1 flex size-2 rounded-full bg-primary ring-2 ring-card" />
        ) : null}
      </button>

      {open ? (
        <div className="absolute end-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 ? (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="text-xs font-medium text-primary hover:underline"
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No notifications.
              </p>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onItemClick(n.id, n.data.order_id)}
                  className={cn(
                    "flex w-full flex-col items-start gap-0.5 border-b border-border px-4 py-3 text-start transition hover:bg-background",
                    !n.read && "bg-primary/5",
                  )}
                >
                  <span className="text-sm font-semibold text-foreground">
                    {n.data.title ?? "Notification"}
                  </span>
                  {n.data.body ? (
                    <span className="text-xs text-muted-foreground">
                      {n.data.body}
                    </span>
                  ) : null}
                  <span className="mt-0.5 text-[11px] text-muted-foreground">
                    {formatDateTime(n.created_at)}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
