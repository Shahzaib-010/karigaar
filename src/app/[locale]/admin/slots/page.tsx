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
import { Badge } from "@/components/ui/badge";
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
import SlotFormSheet from "@/src/components/admin/SlotFormSheet";
import { formatDate } from "@/src/lib/format";
import type { BookingSlot } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useDeleteBookingSlotMutation,
  useGetBookingSlotsQuery,
} from "@/src/store/adminApi";

const ACTIVE_OPTIONS = [
  { value: "", label: "All" },
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

const fieldClass =
  "h-9 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

function hhmm(value?: string) {
  return value ? value.slice(0, 5) : "—";
}

export default function AdminSlotsPage() {
  const [date, setDate] = useState("");
  const [active, setActive] = useState("");

  const args = useMemo(
    () => ({
      date: date || undefined,
      is_active: active === "" ? undefined : active === "1",
    }),
    [date, active],
  );

  const { data: slots, isLoading, isFetching, isError, error, refetch } =
    useGetBookingSlotsQuery(args);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Booking Slots
          </h1>
          <p className="text-sm text-muted-foreground">
            Time windows clients can book into, each with a capacity.
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
          <SlotFormSheet
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add slot
              </Button>
            }
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-muted-foreground">
          Status
          <select
            value={active}
            onChange={(e) => setActive(e.target.value)}
            className={fieldClass}
          >
            {ACTIVE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        {date || active ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-9"
            onClick={() => {
              setDate("");
              setActive("");
            }}
          >
            Clear
          </Button>
        ) : null}
      </div>

      {/* Results */}
      <Card>
        <CardContent className="p-0">
          {isError ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                {(error as AppQueryError | undefined)?.message ??
                  "Could not load slots."}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : isLoading || !slots ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 rounded-md" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No slots yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Booked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">
                      {formatDate(slot.date)}
                    </TableCell>
                    <TableCell>
                      {hhmm(slot.time_from)} – {hhmm(slot.time_to)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {slot.max_bookings}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {slot.booked_count ?? 0} / {slot.max_bookings}
                    </TableCell>
                    <TableCell>
                      {slot.is_active === false ? (
                        <Badge
                          variant="outline"
                          className="border-transparent bg-muted text-muted-foreground"
                        >
                          Inactive
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                        >
                          Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <SlotFormSheet
                          slot={slot}
                          trigger={
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          }
                        />
                        <DeleteSlotButton slot={slot} />
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

function DeleteSlotButton({ slot }: { slot: BookingSlot }) {
  const [deleteSlot, { isLoading }] = useDeleteBookingSlotMutation();

  async function handleDelete() {
    try {
      await deleteSlot(slot.id).unwrap();
      toast.success("Slot deleted");
    } catch (e) {
      // 422 (often Urdu) if the slot already has orders on it.
      const message =
        e && typeof e === "object" && "message" in e
          ? String((e as { message: unknown }).message)
          : "Could not delete slot.";
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
          <AlertDialogTitle>Delete this slot?</AlertDialogTitle>
          <AlertDialogDescription>
            {formatDate(slot.date)} · {hhmm(slot.time_from)}–
            {hhmm(slot.time_to)}. If it already has orders, the server will
            block the delete — reassign those first.
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
