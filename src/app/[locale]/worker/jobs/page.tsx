"use client";

import { useMemo, useState } from "react";
import { RefreshCwIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBadge from "@/src/components/admin/StatusBadge";
import {
  getInitials,
  PageHeader,
  Panel,
} from "@/src/components/admin/DashboardKit";
import { formatDateTime, formatPkr } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetMyOrdersQuery } from "@/src/store/clientApi";
import { livePolling } from "@/src/store/realtime";

const STATUS_OPTIONS = [
  { value: "", label: "All jobs" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PER_PAGE = 15;

export default function WorkerJobsPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const args = useMemo(
    () => ({ page, per_page: PER_PAGE, status: status || undefined }),
    [page, status],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetMyOrdersQuery(args, livePolling);

  const fieldClass =
    "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="My jobs"
        subtitle="Jobs assigned to you."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 rounded-full px-3.5"
          >
            <RefreshCwIcon className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        }
      />

      <Panel className="p-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Status
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={`${fieldClass} w-48`}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </Panel>

      <Panel className="p-0">
        {isError ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm font-medium text-destructive">
              {(error as AppQueryError | undefined)?.message ?? "Could not load jobs."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : isLoading || !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-md" />
            ))}
          </div>
        ) : data.data.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No jobs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Job</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-5 font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {getInitials(order.client?.name ?? `#${order.id}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {order.category?.name ?? `#${order.id}`}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {order.sub_category?.title ?? `Order #${order.id}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.client?.name ?? "—"}</div>
                      {order.address ? (
                        <div className="max-w-48 truncate text-xs text-muted-foreground">
                          {order.address}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {formatDateTime(order.scheduled_at)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap pr-5 text-right tabular-nums">
                      {formatPkr(order.total_amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      {data && data.data.length > 0 ? (
        <div className="flex items-center justify-between gap-3">
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
  );
}
