"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { BookingSlot, BookingSlotInput } from "@/src/lib/api";
import {
  useCreateBookingSlotMutation,
  useUpdateBookingSlotMutation,
} from "@/src/store/adminApi";

type FormState = {
  date: string;
  time_from: string;
  time_to: string;
  max_bookings: string;
  is_active: boolean;
};

function hhmm(value?: string) {
  return value ? value.slice(0, 5) : "";
}

function toForm(slot?: BookingSlot): FormState {
  return {
    date: slot?.date ?? "",
    time_from: hhmm(slot?.time_from),
    time_to: hhmm(slot?.time_to),
    max_bookings: String(slot?.max_bookings ?? 1),
    is_active: slot?.is_active ?? true,
  };
}

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

const fieldClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

export default function SlotFormSheet({
  slot,
  trigger,
}: {
  slot?: BookingSlot;
  trigger: ReactNode;
}) {
  const isEdit = Boolean(slot);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => toForm(slot));

  const [createSlot, { isLoading: isCreating }] =
    useCreateBookingSlotMutation();
  const [updateSlot, { isLoading: isUpdating }] =
    useUpdateBookingSlotMutation();
  const busy = isCreating || isUpdating;

  function handleOpenChange(next: boolean) {
    if (next) setForm(toForm(slot));
    setOpen(next);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const validTimes =
    form.time_from && form.time_to && form.time_from < form.time_to;
  const canSubmit = Boolean(form.date && validTimes) && !busy;

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit() {
    if (!canSubmit) return;

    const max = Number(form.max_bookings);
    const payload: BookingSlotInput = {
      date: form.date,
      time_from: form.time_from,
      time_to: form.time_to,
      max_bookings: Number.isFinite(max) && max > 0 ? max : 1,
      is_active: form.is_active,
    };

    try {
      if (isEdit && slot) {
        await updateSlot({ id: slot.id, ...payload }).unwrap();
        toast.success("Slot updated");
      } else {
        await createSlot(payload).unwrap();
        toast.success("Slot created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit slot" : "Add slot"}</SheetTitle>
          <SheetDescription>
            A time window clients can book into, with a booking cap.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <Field label="Date" required>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
              className={fieldClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="From" required>
              <input
                type="time"
                value={form.time_from}
                onChange={(e) => set("time_from", e.target.value)}
                className={fieldClass}
              />
            </Field>
            <Field label="To" required>
              <input
                type="time"
                value={form.time_to}
                onChange={(e) => set("time_to", e.target.value)}
                className={fieldClass}
              />
            </Field>
          </div>
          {!validTimes && form.time_from && form.time_to ? (
            <p className="text-xs font-medium text-destructive">
              End time must be after start time.
            </p>
          ) : null}

          <Field label="Max bookings">
            <Input
              type="number"
              min={1}
              max={20}
              value={form.max_bookings}
              onChange={(e) => set("max_bookings", e.target.value)}
            />
          </Field>

          <label className="flex items-center justify-between">
            <span className="text-sm font-medium">Active</span>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => set("is_active", v)}
            />
          </label>
        </div>

        <SheetFooter>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Add slot"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
