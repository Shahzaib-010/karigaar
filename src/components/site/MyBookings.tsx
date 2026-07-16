"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/src/components/admin/StatusBadge";
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
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-karigaar text-3xl font-bold text-slate-950">
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
        <div className="mb-5 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className={
                status === f.value
                  ? "rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  : "rounded-full border border-input bg-white px-3 py-1.5 text-sm text-slate-600 hover:border-primary"
              }
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
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                You have no bookings yet.
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
                <Card className="transition-colors hover:border-primary">
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {order.category?.name ?? "Service"}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 truncate text-sm text-slate-600">
                        {order.sub_category?.title ?? ""}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateTime(order.scheduled_at)} · #{order.id}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        {formatPkr(order.total_amount)}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground" />
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
