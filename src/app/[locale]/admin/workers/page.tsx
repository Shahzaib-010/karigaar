"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BriefcaseIcon,
  PlusIcon,
  PowerOffIcon,
  RefreshCwIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import WorkerFormSheet from "@/src/components/admin/WorkerFormSheet";
import {
  PageHeader,
  Panel,
  PanelHead,
  Reveal,
  StatCard,
} from "@/src/components/admin/DashboardKit";
import DonutChart, {
  type DonutDatum,
} from "@/src/components/admin/charts/DonutChart";
import HBarChart from "@/src/components/admin/charts/HBarChart";
import { WORKER_COLORS } from "@/src/components/admin/charts/palette";
import type { Worker } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useDeleteWorkerMutation,
  useGetCategoriesQuery,
  useGetWorkersQuery,
} from "@/src/store/adminApi";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "inactive", label: "Inactive" },
];

const fieldClass =
  "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

export default function AdminWorkersPage() {
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const args = useMemo(
    () => ({
      status: status || undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
    }),
    [status, categoryId],
  );

  const { data: workers, isLoading, isFetching, isError, error, refetch } =
    useGetWorkersQuery(args);
  const { data: categories = [] } = useGetCategoriesQuery();
  // Unfiltered roster for the headline stats + charts (filters only drive the table).
  const { data: allWorkers = [], isLoading: rosterLoading } =
    useGetWorkersQuery();

  const counts = useMemo(() => {
    const c = { available: 0, busy: 0, inactive: 0 };
    for (const w of allWorkers) {
      const s = (w.status ?? "inactive") as keyof typeof c;
      if (s in c) c[s] += 1;
    }
    return c;
  }, [allWorkers]);

  const statusDonut: DonutDatum[] = [
    { key: "available", label: "Available", value: counts.available, color: WORKER_COLORS.available },
    { key: "busy", label: "Busy", value: counts.busy, color: WORKER_COLORS.busy },
    { key: "inactive", label: "Inactive", value: counts.inactive, color: WORKER_COLORS.inactive },
  ];

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of allWorkers) {
      const name = w.category?.name ?? "Uncategorized";
      map.set(name, (map.get(name) ?? 0) + 1);
    }
    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [allWorkers]);

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Workers"
        subtitle="The people orders get assigned to."
        actions={
          <>
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
            <WorkerFormSheet
              categories={categories}
              trigger={
                <Button size="sm" className="h-9 rounded-full px-4">
                  <PlusIcon className="size-4" />
                  Add worker
                </Button>
              }
            />
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {rosterLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={UsersIcon}
                label="Total workers"
                value={allWorkers.length.toLocaleString()}
                note="On the roster"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={UserCheckIcon}
                label="Available"
                value={counts.available.toLocaleString()}
                note="Ready for orders"
                accent={WORKER_COLORS.available}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={BriefcaseIcon}
                label="Busy"
                value={counts.busy.toLocaleString()}
                note="On active jobs"
                accent={WORKER_COLORS.busy}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={PowerOffIcon}
                label="Inactive"
                value={counts.inactive.toLocaleString()}
                note="Not taking work"
                accent={WORKER_COLORS.inactive}
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Charts */}
      {rosterLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <Reveal delay={0.1}>
            <Panel className="h-full">
              <PanelHead title="Availability" subtitle="Roster by status" />
              <div className="px-1 pt-4">
                <DonutChart data={statusDonut} centerLabel="Workers" />
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel className="h-full">
              <PanelHead title="By category" subtitle="Where the workforce sits" />
              <div className="pt-4">
                {byCategory.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No workers yet.
                  </p>
                ) : (
                  <HBarChart
                    labels={byCategory.map(([name]) => name)}
                    values={byCategory.map(([, n]) => n)}
                    formatValue={(n) => `${n} worker${n === 1 ? "" : "s"}`}
                    height={Math.max(byCategory.length * 48, 160)}
                  />
                )}
              </div>
            </Panel>
          </Reveal>
        </div>
      )}

      {/* Filters */}
      <Panel className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={fieldClass}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
            Category
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={fieldClass}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Panel>

      {/* Results */}
      <Panel className="p-0">
        {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load workers."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isLoading || !workers ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : workers.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No workers yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="pl-5 font-medium">{worker.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">{worker.phone ?? "—"}</div>
                      {worker.email ? (
                        <div className="text-xs text-muted-foreground">
                          {worker.email}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{worker.category?.name ?? "—"}</TableCell>
                    <TableCell>{worker.sub_category?.title ?? "—"}</TableCell>
                    <TableCell>
                      <StatusBadge status={worker.status ?? "inactive"} />
                    </TableCell>
                    <TableCell className="pr-5 text-right">
                      <div className="flex justify-end gap-1">
                        <WorkerFormSheet
                          worker={worker}
                          categories={categories}
                          trigger={
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          }
                        />
                        <DeleteWorkerButton worker={worker} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
      </Panel>
    </div>
  );
}

function DeleteWorkerButton({ worker }: { worker: Worker }) {
  const [deleteWorker, { isLoading }] = useDeleteWorkerMutation();

  async function handleDelete() {
    try {
      await deleteWorker(worker.id).unwrap();
      toast.success("Worker deleted");
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Could not delete worker.";
      toast.error(message);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={isLoading}
        >
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {worker.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the worker. Their existing orders stay but become
            unassigned. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
