"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeftIcon, CheckIcon, XCircleIcon } from "lucide-react";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/src/components/admin/StatusBadge";
import ReviewSection from "@/src/components/site/ReviewSection";
import { cn } from "@/lib/utils";
import { formatDateTime, formatPkr } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useCancelOrderMutation,
  useGetMyOrderQuery,
} from "@/src/store/clientApi";

const TIMELINE = [
  { key: "pending", label: "Requested" },
  { key: "assigned", label: "Professional assigned" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
];

export default function BookingDetail({
  locale,
  orderId,
}: {
  locale: string;
  orderId: number;
}) {
  const { data: order, isLoading, isError, error, refetch } =
    useGetMyOrderQuery(orderId, { skip: !Number.isFinite(orderId) });

  const [cancelOrder, { isLoading: cancelling }] = useCancelOrderMutation();

  async function handleCancel() {
    try {
      await cancelOrder(orderId).unwrap();
      toast.success("Booking cancelled");
    } catch (e) {
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Could not cancel booking.";
      toast.error(message);
    }
  }

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/${locale}/bookings`}>
            <ArrowLeftIcon className="size-4" />
            My Bookings
          </Link>
        </Button>

        {isError ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load this booking."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : isLoading || !order ? (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-950">
                  Booking #{order.id}
                </h1>
                <StatusBadge status={order.status} />
              </div>
              {order.status === "pending" ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={cancelling}
                    >
                      Cancel booking
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You can only cancel while it&apos;s still pending. This
                        can&apos;t be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep booking</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancel}>
                        Cancel booking
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : null}
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {order.status === "cancelled" ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-rose-600">
                    <XCircleIcon className="size-5" />
                    This booking was cancelled.
                  </div>
                ) : (
                  <Timeline status={order.status} />
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Row label="Service" value={order.category?.name} />
                <Row label="Type" value={order.sub_category?.title} />
                <Row
                  label="Scheduled"
                  value={formatDateTime(order.scheduled_at)}
                />
                <Row label="Address" value={order.address} />
                <Row label="What you need" value={order.description} />
                {order.client_notes ? (
                  <Row label="Your notes" value={order.client_notes} />
                ) : null}
                <Row
                  label="Professional"
                  value={order.worker?.name ?? "To be assigned"}
                />
                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-lg font-bold">
                    {formatPkr(order.total_amount)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {order.status === "completed" ? (
              <ReviewSection orderId={order.id} />
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}

function Timeline({ status }: { status: string }) {
  const currentIndex = TIMELINE.findIndex((s) => s.key === status);

  return (
    <ol className="space-y-4">
      {TIMELINE.map((step, i) => {
        const done = currentIndex >= 0 && i < currentIndex;
        const current = i === currentIndex;
        const active = done || current;
        return (
          <li key={step.key} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background text-muted-foreground",
              )}
            >
              {done ? <CheckIcon className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                current
                  ? "font-semibold text-slate-900"
                  : active
                    ? "text-slate-700"
                    : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[70%] text-right font-medium">{value || "—"}</span>
    </div>
  );
}
