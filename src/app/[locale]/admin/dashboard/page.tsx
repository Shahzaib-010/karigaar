"use client";

import {
  BanknoteIcon,
  ClipboardListIcon,
  RefreshCwIcon,
  UsersIcon,
  WrenchIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import StatCard from "@/src/components/admin/StatCard";
import StatusBadge from "@/src/components/admin/StatusBadge";
import { formatDate, formatPkr } from "@/src/lib/format";
import type { OrderStatus } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetDashboardStatsQuery } from "@/src/store/adminApi";

const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];

const WORKER_STATUSES = ["available", "busy", "inactive"] as const;

const REVENUE_CAVEAT =
  "Based on when an order was last marked completed, not when the job happened.";

export default function AdminDashboardPage() {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardStatsQuery();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of orders, workers and revenue.
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

      {isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-destructive">
              {(error as AppQueryError | undefined)?.message ??
                "Could not load dashboard."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Overview */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Orders"
              value={data.overview.total_orders.toLocaleString()}
              icon={ClipboardListIcon}
            />
            <StatCard
              label="Total Revenue"
              value={formatPkr(data.overview.total_revenue)}
              icon={BanknoteIcon}
            />
            <StatCard
              label="Total Users"
              value={data.overview.total_users.toLocaleString()}
              icon={UsersIcon}
            />
            <StatCard
              label="Total Workers"
              value={data.overview.total_workers.toLocaleString()}
              icon={WrenchIcon}
            />
          </section>

          {/* Revenue */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Revenue Today"
              value={formatPkr(data.revenue.today)}
              hint={REVENUE_CAVEAT}
            />
            <StatCard
              label="Revenue This Month"
              value={formatPkr(data.revenue.this_month)}
              hint={REVENUE_CAVEAT}
            />
            <StatCard
              label="Revenue Total"
              value={formatPkr(data.revenue.total)}
            />
          </section>

          {/* Breakdown */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Orders by status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {ORDER_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <StatusBadge status={status} />
                    <span className="text-sm font-semibold tabular-nums">
                      {(data.orders_by_status[status] ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Workers by status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {WORKER_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <StatusBadge status={status} />
                    <span className="text-sm font-semibold tabular-nums">
                      {(
                        data.workers_by_status[status] ?? 0
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>

          {/* Recent orders + top categories */}
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Recent orders</CardTitle>
              </CardHeader>
              <CardContent>
                {data.recent_orders.length === 0 ? (
                  <EmptyRow label="No recent orders." />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recent_orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>
                          <TableCell>{order.client?.name ?? "—"}</TableCell>
                          <TableCell>{order.category?.name ?? "—"}</TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPkr(order.total_amount)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatDate(order.created_at ?? order.scheduled_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data.top_categories.length === 0 ? (
                  <EmptyRow label="No data yet." />
                ) : (
                  data.top_categories.map((cat) => (
                    <div
                      key={cat.category_id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {cat.category?.name ?? `Category #${cat.category_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {cat.total_orders.toLocaleString()} orders
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatPkr(cat.total_revenue)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="py-8 text-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-xl lg:col-span-2" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
