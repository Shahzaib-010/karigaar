"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  BanknoteIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  Clock3Icon,
  HourglassIcon,
  ReceiptIcon,
  RefreshCwIcon,
  SearchIcon,
  XCircleIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  MiniStat,
  PageHeader,
  Panel,
  PanelHead,
  Reveal,
  StatCard,
} from "@/src/components/admin/DashboardKit";
import DonutChart, {
  type DonutDatum,
} from "@/src/components/admin/charts/DonutChart";
import { STATUS_COLORS } from "@/src/components/admin/charts/palette";
import { formatDate, formatPkr, toNumber } from "@/src/lib/format";
import type { OrderStatus } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useGetDashboardStatsQuery,
  useGetOrdersQuery,
} from "@/src/store/adminApi";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

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
  const { data: stats, isLoading: statsLoading, refetch: refetchStats } =
    useGetDashboardStatsQuery();

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
    "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

  const totalOrders =
    stats?.overview.total_orders ??
    Object.values(stats?.orders_by_status ?? {}).reduce(
      (sum, v) => sum + (v ?? 0),
      0,
    );
  const totalRevenue = toNumber(stats?.overview.total_revenue);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const donutData: DonutDatum[] = stats
    ? (Object.keys(STATUS_LABELS) as (keyof typeof STATUS_LABELS)[]).map(
        (key) => ({
          key,
          label: STATUS_LABELS[key],
          value: stats.orders_by_status[key as OrderStatus] ?? 0,
          color: STATUS_COLORS[key],
        }),
      )
    : [];

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Orders"
        subtitle="Review bookings, assign workers and update status."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              refetchStats();
            }}
            disabled={isFetching}
            className="h-9 rounded-full px-3.5"
          >
            <RefreshCwIcon className={isFetching ? "size-3.5 animate-spin" : "size-3.5"} />
            Refresh
          </Button>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={ClipboardListIcon}
                label="Total orders"
                value={totalOrders.toLocaleString()}
                note="All time"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={HourglassIcon}
                label="Pending"
                value={(stats.orders_by_status.pending ?? 0).toLocaleString()}
                note="Awaiting assignment"
                accent={STATUS_COLORS.pending}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={Clock3Icon}
                label="In progress"
                value={(stats.orders_by_status.in_progress ?? 0).toLocaleString()}
                note="Currently active"
                accent={STATUS_COLORS.in_progress}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={CheckCircle2Icon}
                label="Completed"
                value={(stats.orders_by_status.completed ?? 0).toLocaleString()}
                note="Closed successfully"
                accent={STATUS_COLORS.completed}
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Distribution + value */}
      {statsLoading || !stats ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)]">
          <Reveal delay={0.1}>
            <Panel className="h-full">
              <PanelHead title="Orders by status" subtitle="Pipeline distribution" />
              <div className="px-1 pt-4">
                <DonutChart data={donutData} centerLabel="Total orders" />
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel className="flex h-full flex-col justify-center gap-5">
              <MiniStat
                icon={BanknoteIcon}
                label="Total revenue"
                value={formatPkr(totalRevenue)}
              />
              <MiniStat
                icon={ReceiptIcon}
                label="Avg. order value"
                value={formatPkr(avgOrderValue)}
              />
              <MiniStat
                icon={XCircleIcon}
                label="Cancelled orders"
                value={(stats.orders_by_status.cancelled ?? 0).toLocaleString()}
                color={STATUS_COLORS.cancelled}
              />
            </Panel>
          </Reveal>
        </div>
      )}

      {/* Filters */}
      <Panel className="p-4">
        <form onSubmit={onApplyFilters} className="flex flex-wrap items-end gap-3">
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
              className="h-9 w-52 rounded-lg"
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

          <Button type="submit" variant="secondary" size="sm" className="h-9 rounded-lg">
            <SearchIcon className="size-4" />
            Apply
          </Button>
        </form>
      </Panel>

      {/* Results */}
      <Panel className="p-0">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Order</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Scheduled</TableHead>
                  <TableHead className="pr-5 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="pl-5 font-medium">#{order.id}</TableCell>
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
                    <TableCell className="pr-5 text-right">
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
          </div>
        )}
      </Panel>

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
