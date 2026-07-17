"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { formatPkr } from "@/src/lib/format";
import {
  useCreateOrderMutation,
  useGetAvailableSlotsQuery,
  useGetCatalogQuery,
} from "@/src/store/clientApi";
import { livePolling } from "@/src/store/realtime";

function hhmm(v: string) {
  return v ? v.slice(0, 5) : "";
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
  return "Could not place your booking.";
}

const fieldClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

export default function BookingFlow({
  locale,
  priceCategoryId,
}: {
  locale: string;
  priceCategoryId: number;
}) {
  const { user } = useAuth();
  const { data: catalog, isLoading: catalogLoading } = useGetCatalogQuery();

  const [date, setDate] = useState("");
  const [slotId, setSlotId] = useState<number | null>(null);
  const [address, setAddress] = useState(user?.address ?? "");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [placedId, setPlacedId] = useState<number | null>(null);

  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();

  const { data: slots, isFetching: slotsLoading } = useGetAvailableSlotsQuery(
    { date },
    { skip: !date, ...livePolling },
  );

  // Locate the chosen price plan within the catalog tree.
  let plan;
  for (const c of catalog ?? []) {
    for (const s of c.sub_categories ?? []) {
      for (const p of s.category_pricings ?? []) {
        if (p.id === priceCategoryId) {
          plan = { price: p, sub: s, category: c };
        }
      }
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const canSubmit = Boolean(
    date && slotId && address.trim() && description.trim() && !placing,
  );

  async function handleSubmit() {
    if (!canSubmit || !slotId) return;
    try {
      const res = (await createOrder({
        price_category_id: priceCategoryId,
        booking_slot_id: slotId,
        description: description.trim(),
        address: address.trim(),
        client_notes: notes.trim() || undefined,
      }).unwrap()) as { data?: { id?: number } } | undefined;
      setPlacedId(res?.data?.id ?? 0);
      toast.success("Booking placed");
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  if (catalogLoading) {
    return (
      <Shell locale={locale}>
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 rounded-xl lg:col-span-2" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </Shell>
    );
  }

  if (!plan) {
    return (
      <Shell locale={locale}>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm font-medium">This service is unavailable.</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/${locale}/services`}>Back to services</Link>
            </Button>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  if (placedId !== null) {
    return (
      <Shell locale={locale}>
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CheckCircle2Icon className="size-12 text-primary" />
            <h2 className="text-xl font-bold">Booking requested</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              We&apos;ve received your booking and will review it, then assign a
              verified professional. You&apos;ll see updates under My Bookings.
            </p>
            <div className="mt-2 flex gap-2">
              <Button asChild>
                <Link href={`/${locale}/bookings`}>View my bookings</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={`/${locale}/services`}>Book another</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Shell>
    );
  }

  return (
    <Shell locale={locale}>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">1. Choose a date</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSlotId(null);
                }}
                className={cn(fieldClass, "max-w-xs")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">2. Pick a time slot</CardTitle>
            </CardHeader>
            <CardContent>
              {!date ? (
                <p className="text-sm text-muted-foreground">
                  Choose a date first.
                </p>
              ) : slotsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading slots…
                </p>
              ) : !slots || slots.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No slots available for this date.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const full = slot.remaining <= 0;
                    const selected = slotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={full}
                        onClick={() => setSlotId(slot.id)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors",
                          selected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input hover:border-primary",
                          full && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {hhmm(slot.time_from)}–{hhmm(slot.time_to)}
                        <span
                          className={cn(
                            "ml-2 text-xs",
                            selected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground",
                          )}
                        >
                          {full ? "Full" : `${slot.remaining} left`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">3. Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">
                  Address<span className="text-destructive"> *</span>
                </span>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Where should we come?"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">
                  What do you need?<span className="text-destructive"> *</span>
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe the job"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Notes (optional)</span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Anything else we should know?"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
                />
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold">{plan.category.name}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.sub.title}
                  {plan.price.job_type ? ` · ${plan.price.job_type}` : ""}
                </p>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="text-xl font-bold">
                  {formatPkr(plan.price.price)}
                </span>
              </div>
              <Button
                className="w-full"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                {placing ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : null}
                Confirm booking
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We&apos;ll review and assign a professional after you book.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Shell>
  );
}

function Shell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href={`/${locale}/services`}>
            <ArrowLeftIcon className="size-4" />
            Services
          </Link>
        </Button>
        {children}
      </div>
    </main>
  );
}
