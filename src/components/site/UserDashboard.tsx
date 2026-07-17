"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  CheckCircle2Icon,
  ClipboardListIcon,
  ClockIcon,
  Loader2Icon,
  UserCheckIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/src/components/admin/StatCard";
import StatusBadge from "@/src/components/admin/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime, formatPkr } from "@/src/lib/format";
import { useGetMyOrdersQuery } from "@/src/store/clientApi";
import { livePolling } from "@/src/store/realtime";

const STATUS_CARDS: { status: string; label: string; icon: LucideIcon }[] = [
  { status: "pending", label: "Pending", icon: ClockIcon },
  { status: "assigned", label: "Assigned", icon: UserCheckIcon },
  { status: "in_progress", label: "In progress", icon: Loader2Icon },
  { status: "completed", label: "Completed", icon: CheckCircle2Icon },
  { status: "cancelled", label: "Cancelled", icon: XCircleIcon },
];

export default function UserDashboard({ locale }: { locale: string }) {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  // Recent orders + grand total (server scopes to the current user).
  const { data: recent } = useGetMyOrdersQuery({ per_page: 5 }, livePolling);

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-karigaar text-3xl font-bold text-slate-950">
              Hi, {firstName}
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Here&apos;s an overview of your bookings.
            </p>
          </div>
          <Button asChild>
            <Link href={`/${locale}/services`}>Book a service</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard
            label="Total"
            value={recent ? recent.total.toLocaleString() : "…"}
            icon={ClipboardListIcon}
          />
          {STATUS_CARDS.map((c) => (
            <StatusCount
              key={c.status}
              status={c.status}
              label={c.label}
              icon={c.icon}
            />
          ))}
        </div>

        {/* Recent bookings */}
        <Card className="mt-8">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent bookings</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href={`/${locale}/bookings`}>View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {!recent ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Loading…
              </p>
            ) : recent.data.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  You have no bookings yet.
                </p>
                <Button asChild size="sm">
                  <Link href={`/${locale}/services`}>Book a service</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recent.data.map((order) => (
                  <Link
                    key={order.id}
                    href={`/${locale}/bookings/${order.id}`}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">
                          {order.category?.name ?? "Service"}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDateTime(order.scheduled_at)} · #{order.id}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-900">
                      {formatPkr(order.total_amount)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

/** Reads the paginator `total` of a status-filtered query for an exact count. */
function StatusCount({
  status,
  label,
  icon,
}: {
  status: string;
  label: string;
  icon: LucideIcon;
}) {
  const { data } = useGetMyOrdersQuery({ status, per_page: 1 }, livePolling);
  return (
    <StatCard
      label={label}
      value={data ? data.total.toLocaleString() : "…"}
      icon={icon}
    />
  );
}
