"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PlusIcon, RefreshCwIcon } from "lucide-react";

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
import { Card, CardContent } from "@/components/ui/card";
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
  "h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workers</h1>
          <p className="text-sm text-muted-foreground">
            The people orders get assigned to.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <WorkerFormSheet
            categories={categories}
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add worker
              </Button>
            }
          />
        </div>
      </div>

      {/* Filters */}
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

      {/* Results */}
      <Card>
        <CardContent className="p-0">
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub-category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
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
                    <TableCell className="text-right">
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
          )}
        </CardContent>
      </Card>
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
