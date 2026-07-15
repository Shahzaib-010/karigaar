"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/src/components/admin/StatusBadge";
import { formatDateTime, formatPkr } from "@/src/lib/format";
import type { Order } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useAssignWorkerMutation,
  useGetAvailableWorkersQuery,
  useGetOrderQuery,
  useUpdateOrderStatusMutation,
} from "@/src/store/adminApi";

function errMessage(e: unknown): string {
  if (
    e &&
    typeof e === "object" &&
    "message" in e &&
    typeof (e as { message: unknown }).message === "string"
  ) {
    return (e as { message: string }).message;
  }
  return "Something went wrong.";
}

export default function AdminOrderDetailPage() {
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data: order, isLoading, isError, error, refetch } = useGetOrderQuery(
    id,
    { skip: !Number.isFinite(id) },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/admin/orders`}>
            <ArrowLeftIcon className="size-4" />
            Orders
          </Link>
        </Button>
      </div>

      {isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm font-medium text-destructive">
              {(error as AppQueryError | undefined)?.message ??
                "Could not load order."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : isLoading || !order ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 rounded-xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                Order #{order.id}
              </h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDateTime(order.created_at)}
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: service + notes */}
            <div className="space-y-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Category" value={order.category?.name} />
                  <InfoRow
                    label="Sub-category"
                    value={order.sub_category?.title}
                  />
                  <InfoRow
                    label="Price plan"
                    value={
                      order.price_category
                        ? [
                            order.price_category.job_type,
                            order.price_category.complexity,
                            order.price_category.duration,
                          ]
                            .filter(Boolean)
                            .join(" · ") || "—"
                        : "—"
                    }
                  />
                  <InfoRow
                    label="Amount"
                    value={formatPkr(order.total_amount)}
                  />
                  <InfoRow
                    label="Scheduled"
                    value={formatDateTime(order.scheduled_at)}
                  />
                  <InfoRow label="Address" value={order.address} />
                </CardContent>
              </Card>

              {(order.description ||
                order.client_notes ||
                order.admin_notes) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <InfoRow
                      label="Description"
                      value={order.description}
                    />
                    <InfoRow label="Client notes" value={order.client_notes} />
                    <InfoRow label="Admin notes" value={order.admin_notes} />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right: client, worker, actions */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Client</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <InfoRow label="Name" value={order.client?.name} />
                  <InfoRow label="Email" value={order.client?.email} />
                  <InfoRow label="Phone" value={order.client?.phone_number} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Worker</CardTitle>
                </CardHeader>
                <CardContent>
                  {order.worker ? (
                    <p className="text-sm font-medium">{order.worker.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Not assigned
                    </p>
                  )}
                </CardContent>
              </Card>

              <OrderActions order={order} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}

function OrderActions({ order }: { order: Order }) {
  const [workerId, setWorkerId] = useState<string>("");

  const [assignWorker, { isLoading: isAssigning }] = useAssignWorkerMutation();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const isPending = order.status === "pending";
  const isAssigned = order.status === "assigned";
  const isInProgress = order.status === "in_progress";
  const isTerminal =
    order.status === "completed" || order.status === "cancelled";

  const categoryId = order.category?.id;
  const { data: workers, isLoading: workersLoading } =
    useGetAvailableWorkersQuery(categoryId as number, {
      skip: !isPending || !categoryId,
    });

  const busy = isAssigning || isUpdating;

  async function handleAssign() {
    if (!workerId) return;
    try {
      await assignWorker({ id: order.id, worker_id: Number(workerId) }).unwrap();
      toast.success("Worker assigned");
      setWorkerId("");
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  async function handleStatus(status: string, successMsg: string) {
    try {
      await updateStatus({ id: order.id, status }).unwrap();
      toast.success(successMsg);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  if (isTerminal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This order is {order.status}. No further actions.
          </p>
        </CardContent>
      </Card>
    );
  }

  const inputClass =
    "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isPending ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Assign a worker
            </label>
            <select
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              disabled={workersLoading || busy}
              className={inputClass}
            >
              <option value="">
                {workersLoading
                  ? "Loading workers…"
                  : workers && workers.length
                    ? "Select a worker"
                    : "No available workers"}
              </option>
              {workers?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                  {w.sub_category?.title ? ` — ${w.sub_category.title}` : ""}
                </option>
              ))}
            </select>
            <Button
              className="w-full"
              size="sm"
              disabled={!workerId || busy}
              onClick={handleAssign}
            >
              {isAssigning ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Assign worker
            </Button>
          </div>
        ) : null}

        {isAssigned ? (
          <Button
            className="w-full"
            size="sm"
            disabled={busy}
            onClick={() => handleStatus("in_progress", "Job started")}
          >
            {isUpdating ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Start job
          </Button>
        ) : null}

        {isInProgress ? (
          <Button
            className="w-full"
            size="sm"
            disabled={busy}
            onClick={() => handleStatus("completed", "Order completed")}
          >
            {isUpdating ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Mark completed
          </Button>
        ) : null}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive hover:text-destructive"
              disabled={busy}
            >
              Cancel order
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
              <AlertDialogDescription>
                This sets order #{order.id} to cancelled and frees any assigned
                worker. This can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep order</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleStatus("cancelled", "Order cancelled")}
              >
                Cancel order
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
