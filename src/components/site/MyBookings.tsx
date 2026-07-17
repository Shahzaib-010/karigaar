"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarIcon,
  HashIcon,
  RefreshCwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/src/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import { formatDateTime, formatPkr } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetMyOrdersQuery } from "@/src/store/clientApi";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PER_PAGE = 10;

export default function MyBookings({ locale }: { locale: string }) {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const args = useMemo(
    () => ({ page, per_page: PER_PAGE, status: status || undefined }),
    [page, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyOrdersQuery(args);

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-karigaar text-3xl font-bold text-slate-950 sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Track your service requests and their status.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCwIcon
              className={isFetching ? "size-4 animate-spin" : "size-4"}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {/* Status filter */}
        <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                status === f.value
                  ? "bg-[var(--primary)] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-[var(--primary)] hover:text-[var(--primary)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isError ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load your bookings."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading || !data ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#E6F4EF] text-2xl text-[var(--primary)]">
                📋
              </div>
              <p className="text-sm text-muted-foreground">
                {status
                  ? "No bookings with this status."
                  : "You have no bookings yet."}
              </p>
              <Button asChild>
                <Link href={`/${locale}/services`}>Book a service</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {data.data.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/bookings/${order.id}`}
                className="block"
              >
                <Card className="group rounded-2xl border-slate-200 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--primary)] hover:shadow-[0_14px_36px_rgba(1,73,62,0.10)]">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E6F4EF] text-lg font-bold uppercase text-[var(--primary)]">
                      {order.category?.name?.charAt(0) ?? "•"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-slate-900">
                          {order.category?.name ?? "Service"}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      {order.sub_category?.title ? (
                        <p className="mt-0.5 truncate text-sm text-slate-600">
                          {order.sub_category.title}
                        </p>
                      ) : null}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <CalendarIcon className="size-3.5" />
                          {formatDateTime(order.scheduled_at)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <HashIcon className="size-3.5" />
                          {order.id}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="text-base font-bold text-slate-900">
                        {formatPkr(order.total_amount)}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {data && data.data.length > 0 ? (
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {data.current_page} of {data.last_page} · {data.total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.current_page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.current_page >= data.last_page || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
