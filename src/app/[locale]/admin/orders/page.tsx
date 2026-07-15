"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { RefreshCwIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { formatDate, formatPkr } from "@/src/lib/format";
import type { OrderStatus } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetOrdersQuery } from "@/src/store/adminApi";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PER_PAGE = 20;

export default function AdminOrdersPage() {
  const locale = useLocale();

  const [status, setStatus] = useState("");
  const [clientInput, setClientInput] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [applied, setApplied] = useState({ client: "", from: "", to: "" });
  const [page, setPage] = useState(1);

  const args = useMemo(
    () => ({
      page,
      per_page: PER_PAGE,
      status: status || undefined,
      client: applied.client || undefined,
      from: applied.from || undefined,
      to: applied.to || undefined,
    }),
    [page, status, applied],
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetOrdersQuery(args);

  function onStatusChange(value: string) {
    setStatus(value);
    setPage(1);
  }

  function onApplyFilters(e: FormEvent) {
    e.preventDefault();
    setApplied({ client: clientInput.trim(), from: fromInput, to: toInput });
    setPage(1);
  }

  const inputClass =
    "h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">
            Review bookings, assign workers and update status.
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

      {/* Filters */}
      <form
        onSubmit={onApplyFilters}
        className="flex flex-wrap items-end gap-3"
      >
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Status
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Client
          <Input
            value={clientInput}
            onChange={(e) => setClientInput(e.target.value)}
            placeholder="Name or email"
            className="h-9 w-52"
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          From
          <input
            type="date"
            value={fromInput}
            onChange={(e) => setFromInput(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          To
          <input
            type="date"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            className={inputClass}
          />
        </label>

        <Button type="submit" variant="secondary" size="sm" className="h-9">
          <SearchIcon className="size-4" />
          Apply
        </Button>
      </form>

      {/* Results */}
      <Card>
        <CardContent className="p-0">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load orders."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isLoading || !data ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : data.data.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No orders found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Scheduled</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.client?.name ?? "—"}</TableCell>
                    <TableCell>
                      {order.category?.name ?? "—"}
                      {order.sub_category?.title ? (
                        <span className="text-muted-foreground">
                          {" "}
                          · {order.sub_category.title}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      {order.worker?.name ?? (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status as OrderStatus} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatPkr(order.total_amount)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatDate(order.scheduled_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/${locale}/admin/orders/${order.id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
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
