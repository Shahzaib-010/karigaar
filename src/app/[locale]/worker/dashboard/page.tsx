"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ClipboardListIcon,
  Clock3Icon,
  RefreshCwIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/src/components/admin/StatusBadge";
import {
  getInitials,
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
import { formatDateTime, formatPkr } from "@/src/lib/format";
import { useGetMyOrdersQuery } from "@/src/store/clientApi";
import { livePolling } from "@/src/store/realtime";

export default function WorkerDashboardPage() {
  const locale = useLocale();
  const base = `/${locale}/worker`;

  // The API scopes /orders to the caller — for a worker that's their assigned
  // jobs. One lightweight count query per status + a small "next up" list.
  const assigned = useGetMyOrdersQuery({ status: "assigned", per_page: 1 }, livePolling);
  const inProgress = useGetMyOrdersQuery({ status: "in_progress", per_page: 1 }, livePolling);
  const completed = useGetMyOrdersQuery({ status: "completed", per_page: 1 }, livePolling);
  const cancelled = useGetMyOrdersQuery({ status: "cancelled", per_page: 1 }, livePolling);
  const upcoming = useGetMyOrdersQuery({ per_page: 6 }, livePolling);

  const counts = {
    assigned: assigned.data?.total ?? 0,
    in_progress: inProgress.data?.total ?? 0,
    completed: completed.data?.total ?? 0,
    cancelled: cancelled.data?.total ?? 0,
  };
  const total =
    counts.assigned + counts.in_progress + counts.completed + counts.cancelled;

  const loading =
    assigned.isLoading ||
    inProgress.isLoading ||
    completed.isLoading ||
    cancelled.isLoading;

  const donut: DonutDatum[] = [
    { key: "assigned", label: "Assigned", value: counts.assigned, color: STATUS_COLORS.assigned },
    { key: "in_progress", label: "In progress", value: counts.in_progress, color: STATUS_COLORS.in_progress },
    { key: "completed", label: "Completed", value: counts.completed, color: STATUS_COLORS.completed },
    { key: "cancelled", label: "Cancelled", value: counts.cancelled, color: STATUS_COLORS.cancelled },
  ];

  const refreshAll = () => {
    assigned.refetch();
    inProgress.refetch();
    completed.refetch();
    cancelled.refetch();
    upcoming.refetch();
  };

  const nextUp = (upcoming.data?.data ?? []).filter(
    (o) => o.status === "assigned" || o.status === "in_progress",
  );

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Dashboard"
        subtitle="Your assigned work at a glance."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAll}
              className="h-9 rounded-full px-3.5"
            >
              <RefreshCwIcon className="size-3.5" />
              Refresh
            </Button>
            <Button asChild size="sm" className="h-9 rounded-full px-4">
              <Link href={`${base}/jobs`}>
                My jobs
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={ClipboardListIcon}
                label="Assigned"
                value={counts.assigned.toLocaleString()}
                note="Waiting to start"
                accent={STATUS_COLORS.assigned}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={Clock3Icon}
                label="In progress"
                value={counts.in_progress.toLocaleString()}
                note="Currently working"
                accent={STATUS_COLORS.in_progress}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={CheckCircle2Icon}
                label="Completed"
                value={counts.completed.toLocaleString()}
                note="Finished jobs"
                accent={STATUS_COLORS.completed}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={BriefcaseIcon}
                label="Total jobs"
                value={total.toLocaleString()}
                note="All time"
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Breakdown + next up */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Reveal delay={0.1}>
          <Panel className="h-full">
            <PanelHead title="Your jobs" subtitle="By status" />
            <div className="px-1 pt-4">
              {loading ? (
                <Skeleton className="h-48 rounded-2xl" />
              ) : (
                <DonutChart data={donut} centerLabel="Total jobs" />
              )}
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.15}>
          <Panel className="h-full p-0">
            <div className="flex items-center justify-between gap-3 px-5 pt-5">
              <PanelHead title="Next up" subtitle="Assigned & in-progress jobs" />
              <Button asChild variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs">
                <Link href={`${base}/jobs`}>
                  View all
                  <ArrowUpRightIcon className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-3 divide-y divide-border/60">
              {upcoming.isLoading ? (
                <div className="space-y-2 p-5">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : nextUp.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No active jobs right now.
                </p>
              ) : (
                nextUp.map((order) => (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {getInitials(order.client?.name ?? `#${order.id}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {order.category?.name ?? "Job"}
                        {order.sub_category?.title ? (
                          <span className="text-muted-foreground">
                            {" "}· {order.sub_category.title}
                          </span>
                        ) : null}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {order.client?.name ?? "—"} · {formatDateTime(order.scheduled_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <StatusBadge status={order.status} />
                      <span className="text-xs font-medium tabular-nums text-muted-foreground">
                        {formatPkr(order.total_amount)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </Reveal>
      </div>
    </div>
  );
}
