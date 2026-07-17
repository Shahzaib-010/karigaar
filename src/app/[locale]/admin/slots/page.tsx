"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarCheckIcon,
  CalendarClockIcon,
  PlusIcon,
  RefreshCwIcon,
  TicketIcon,
  Users2Icon,
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
import { Badge } from "@/components/ui/badge";
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
import SlotFormSheet from "@/src/components/admin/SlotFormSheet";
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
import RadialGauge from "@/src/components/admin/charts/RadialGauge";
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
  "h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

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
  // Unfiltered set for the headline stats + charts.
  const { data: allSlots = [], isLoading: statsLoading } =
    useGetBookingSlotsQuery();

  const stats = useMemo(() => {
    let activeCount = 0;
    let capacity = 0;
    let booked = 0;
    for (const s of allSlots) {
      if (s.is_active !== false) activeCount += 1;
      capacity += s.max_bookings ?? 0;
      booked += s.booked_count ?? 0;
    }
    return {
      total: allSlots.length,
      active: activeCount,
      inactive: allSlots.length - activeCount,
      capacity,
      booked,
      utilization: capacity > 0 ? booked / capacity : 0,
    };
  }, [allSlots]);

  const statusDonut: DonutDatum[] = [
    { key: "active", label: "Active", value: stats.active, color: "#10B981" },
    { key: "inactive", label: "Inactive", value: stats.inactive, color: "#94A3B8" },
  ];

  return (
    <div className="w-full space-y-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-5">
      <PageHeader
        title="Booking Slots"
        subtitle="Time windows clients can book into, each with a capacity."
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
            <SlotFormSheet
              trigger={
                <Button size="sm" className="h-9 rounded-full px-4">
                  <PlusIcon className="size-4" />
                  Add slot
                </Button>
              }
            />
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))
        ) : (
          <>
            <Reveal>
              <StatCard
                icon={CalendarClockIcon}
                label="Total slots"
                value={stats.total.toLocaleString()}
                note="Across all dates"
              />
            </Reveal>
            <Reveal delay={0.05}>
              <StatCard
                icon={CalendarCheckIcon}
                label="Active slots"
                value={stats.active.toLocaleString()}
                note="Open for booking"
                accent="#10B981"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <StatCard
                icon={TicketIcon}
                label="Total capacity"
                value={stats.capacity.toLocaleString()}
                note="Bookable seats"
                accent="#0EA5E9"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <StatCard
                icon={Users2Icon}
                label="Seats booked"
                value={stats.booked.toLocaleString()}
                note={`${Math.round(stats.utilization * 100)}% utilized`}
                accent="#F59E0B"
              />
            </Reveal>
          </>
        )}
      </div>

      {/* Charts */}
      {statsLoading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <Reveal delay={0.1}>
            <Panel className="flex h-full flex-col">
              <PanelHead title="Capacity utilization" subtitle="Booked vs. total seats" />
              <div className="flex flex-1 flex-col items-center justify-center py-4">
                <RadialGauge
                  value={stats.utilization}
                  label="Utilized"
                  sublabel={`${stats.booked} of ${stats.capacity} seats`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
                <MiniStat icon={TicketIcon} label="Capacity" value={stats.capacity} color="#0EA5E9" />
                <MiniStat icon={Users2Icon} label="Booked" value={stats.booked} color="#F59E0B" />
              </div>
            </Panel>
          </Reveal>
          <Reveal delay={0.15}>
            <Panel className="h-full">
              <PanelHead title="Slot status" subtitle="Active vs. inactive" />
              <div className="px-1 pt-4">
                <DonutChart data={statusDonut} centerLabel="Slots" />
              </div>
            </Panel>
          </Reveal>
        </div>
      )}

      {/* Filters */}
      <Panel className="p-4">
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
      </Panel>

      {/* Results */}
      <Panel className="p-0">
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
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-5">Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Capacity</TableHead>
                  <TableHead className="text-right">Booked</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((slot) => (
                  <TableRow key={slot.id}>
                    <TableCell className="pl-5 font-medium">
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
                    <TableCell className="pr-5 text-right">
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
            </div>
          )}
      </Panel>
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
