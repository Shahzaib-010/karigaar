"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRightIcon,
  BanknoteIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  Clock3Icon,
  CoinsIcon,
  HourglassIcon,
  ReceiptIcon,
  RefreshCwIcon,
  UserCogIcon,
  UsersIcon,
} from "lucide-react";

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
import { cn } from "@/lib/utils";
import { formatDate, formatPkr, toNumber } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetDashboardStatsQuery } from "@/src/store/adminApi";
import StatusBadge from "@/src/components/admin/StatusBadge";
import {
  getInitials,
  KpiCard,
  MiniStat,
  PageHeader,
  Panel,
  PanelHead,
  Reveal,
  StatCard,
} from "@/src/components/admin/DashboardKit";
import CountUp from "@/src/components/admin/charts/CountUp";
import DonutChart, {
  type DonutDatum,
} from "@/src/components/admin/charts/DonutChart";
import HBarChart from "@/src/components/admin/charts/HBarChart";
import RadialGauge from "@/src/components/admin/charts/RadialGauge";
import {
  STATUS_COLORS,
  WORKER_COLORS,
} from "@/src/components/admin/charts/palette";

const ORDER_STATUS_ORDER = [
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
] as const;

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardStatsQuery();

  const locale = pathname.split("/")[1] || "en";
  const admin = `/${locale}/admin`;

  const completedOrders = data?.orders_by_status.completed ?? 0;
  const totalOrders =
    data?.overview.total_orders ??
    Object.values(data?.orders_by_status ?? {}).reduce(
      (sum, value) => sum + (value ?? 0),
      0
    );
  const totalWorkers =
    (data?.workers_by_status.available ?? 0) +
    (data?.workers_by_status.busy ?? 0) +
    (data?.workers_by_status.inactive ?? 0);
  const activeWorkers =
    (data?.workers_by_status.available ?? 0) +
    (data?.workers_by_status.busy ?? 0);
  const completionRate = totalOrders > 0 ? completedOrders / totalOrders : 0;
  const activeWorkerRate = totalWorkers > 0 ? activeWorkers / totalWorkers : 0;
  const totalRevenue = toNumber(data?.overview.total_revenue);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const donutData: DonutDatum[] = data
    ? ORDER_STATUS_ORDER.map((status) => ({
        key: status,
        label: STATUS_LABELS[status],
        value: data.orders_by_status[status] ?? 0,
        color: STATUS_COLORS[status],
      }))
    : [];

  const workerData: DonutDatum[] = data
    ? [
        {
          key: "available",
          label: "Available",
          value: data.workers_by_status.available ?? 0,
          color: WORKER_COLORS.available,
        },
        {
          key: "busy",
          label: "Busy",
          value: data.workers_by_status.busy ?? 0,
          color: WORKER_COLORS.busy,
        },
        {
          key: "inactive",
          label: "Inactive",
          value: data.workers_by_status.inactive ?? 0,
          color: WORKER_COLORS.inactive,
        },
      ]
    : [];

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Dashboard overview"
        subtitle="Real-time snapshot of orders, revenue and workforce."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 rounded-full px-3.5"
            >
              <RefreshCwIcon className={cn("size-3.5", isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button asChild size="sm" className="h-9 rounded-full px-4">
              <Link href={`${admin}/orders`}>
                View orders
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </Button>
          </>
        }
      />

      {isError ? (
        <Panel className="border-destructive/30 bg-destructive/5">
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-medium text-destructive">
              {(error as AppQueryError | undefined)?.message ??
                "Could not load dashboard."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        </Panel>
      ) : isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Reveal>
              <KpiCard
                highlighted
                label="Total orders"
                icon={ClipboardListIcon}
                href={`${admin}/orders`}
                note="Live workload"
                value={<CountUp value={totalOrders} />}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <KpiCard
                label="Total revenue"
                icon={BanknoteIcon}
                note="Cumulative earnings"
                value={<CountUp value={totalRevenue} format={(n) => formatPkr(n)} />}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <KpiCard
                label="Active workers"
                icon={UsersIcon}
                href={`${admin}/workers`}
                note={`${Math.round(activeWorkerRate * 100)}% of ${totalWorkers} available`}
                value={<CountUp value={activeWorkers} />}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <KpiCard
                label="Registered users"
                icon={UserCogIcon}
                href={`${admin}/users`}
                note="Platform accounts"
                value={<CountUp value={data.overview.total_users} />}
              />
            </Reveal>
          </div>

          {/* Distribution + completion */}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.7fr)]">
            <Reveal delay={0.1}>
              <Panel className="h-full">
                <PanelHead
                  title="Orders by status"
                  subtitle="Distribution across the pipeline"
                />
                <div className="px-1 pt-4">
                  <DonutChart data={donutData} centerLabel="Total orders" />
                </div>
              </Panel>
            </Reveal>

            <Reveal delay={0.15}>
              <Panel className="flex h-full flex-col">
                <PanelHead title="Completion" subtitle="Closed vs. total" />
                <div className="flex flex-1 flex-col items-center justify-center py-4">
                  <RadialGauge
                    value={completionRate}
                    label="Completed"
                    sublabel={`${completedOrders} of ${totalOrders}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                  <MiniStat
                    icon={Clock3Icon}
                    label="In progress"
                    value={data.orders_by_status.in_progress ?? 0}
                    color={STATUS_COLORS.in_progress}
                  />
                  <MiniStat
                    icon={HourglassIcon}
                    label="Pending"
                    value={data.orders_by_status.pending ?? 0}
                    color={STATUS_COLORS.pending}
                  />
                </div>
              </Panel>
            </Reveal>
          </div>

          {/* Secondary business stats */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Reveal>
              <StatCard
                icon={ReceiptIcon}
                label="Avg. order value"
                value={formatPkr(avgOrderValue)}
                note="Revenue per order"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={CoinsIcon}
                label="Revenue today"
                value={formatPkr(data.revenue.today)}
                note="Since midnight"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={CalendarDaysIcon}
                label="Revenue this month"
                value={formatPkr(data.revenue.this_month)}
                note="Month to date"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={HourglassIcon}
                label="Pending orders"
                value={(data.orders_by_status.pending ?? 0).toLocaleString()}
                note="Awaiting assignment"
                accent={STATUS_COLORS.pending}
              />
            </Reveal>
          </div>

          {/* Graphs: categories + workers */}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
            <Reveal delay={0.1}>
              <Panel className="h-full">
                <PanelHead title="Top categories" subtitle="Revenue by demand" />
                <div className="pt-4">
                  {data.top_categories.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No category data yet.
                    </p>
                  ) : (
                    <HBarChart
                      labels={data.top_categories.map(
                        (c) => c.category?.name ?? `Category #${c.category_id}`
                      )}
                      values={data.top_categories.map((c) => toNumber(c.total_revenue))}
                      formatValue={(n) => formatPkr(n)}
                      height={Math.max(data.top_categories.length * 48, 180)}
                    />
                  )}
                </div>
              </Panel>
            </Reveal>

            <Reveal delay={0.15}>
              <Panel className="flex h-full flex-col">
                <PanelHead
                  title="Worker availability"
                  subtitle={`${totalWorkers} on the roster`}
                />
                <div className="flex flex-1 items-center pt-4">
                  <DonutChart data={workerData} size={150} centerLabel="Workers" />
                </div>
              </Panel>
            </Reveal>
          </div>

          {/* Recent orders — full width */}
          <Reveal delay={0.1}>
            <Panel className="p-0">
              <div className="flex items-center justify-between gap-3 px-5 pt-5">
                <PanelHead title="Recent orders" subtitle="Latest activity" />
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full px-3 text-xs"
                >
                  <Link href={`${admin}/orders`}>
                    View all
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-3 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="pl-5">Project</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="pr-5 text-right">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recent_orders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          No recent orders yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.recent_orders.map((order) => (
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
                                  #{order.id}
                                </div>
                                <div className="truncate text-xs text-muted-foreground">
                                  {order.category?.name ?? "Uncategorized"}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {order.client?.name ?? "—"}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-right tabular-nums">
                            {formatPkr(order.total_amount)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap pr-5 text-right text-muted-foreground">
                            {formatDate(order.created_at ?? order.scheduled_at)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </Reveal>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-38 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.7fr)]">
        <Skeleton className="h-76 rounded-2xl" />
        <Skeleton className="h-76 rounded-2xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.85fr)]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );
}
