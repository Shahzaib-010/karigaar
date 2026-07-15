"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category, Worker, WorkerInput } from "@/src/lib/api";
import {
  useCreateWorkerMutation,
  useUpdateWorkerMutation,
} from "@/src/store/adminApi";

const STATUSES = ["available", "busy", "inactive"] as const;

type FormState = {
  name: string;
  phone: string;
  email: string;
  category_id: string;
  sub_category_id: string;
  status: string;
  notes: string;
};

function toForm(worker?: Worker): FormState {
  return {
    name: worker?.name ?? "",
    phone: worker?.phone ?? "",
    email: worker?.email ?? "",
    category_id: worker?.category?.id ? String(worker.category.id) : "",
    sub_category_id: worker?.sub_category?.id
      ? String(worker.sub_category.id)
      : "",
    status: worker?.status ?? "available",
    notes: worker?.notes ?? "",
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

export default function WorkerFormSheet({
  worker,
  categories,
  trigger,
}: {
  worker?: Worker;
  categories: Category[];
  trigger: ReactNode;
}) {
  const isEdit = Boolean(worker);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(() => toForm(worker));

  const [createWorker, { isLoading: isCreating }] = useCreateWorkerMutation();
  const [updateWorker, { isLoading: isUpdating }] = useUpdateWorkerMutation();
  const busy = isCreating || isUpdating;

  function handleOpenChange(next: boolean) {
    if (next) setForm(toForm(worker)); // reset from latest prop each time it opens
    setOpen(next);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const subCategories =
    categories.find((c) => String(c.id) === form.category_id)?.sub_categories ??
    [];

  const canSubmit =
    form.name.trim() && form.phone.trim() && form.category_id && !busy;

  async function handleSubmit() {
    if (!canSubmit) return;

    const payload: WorkerInput = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      category_id: Number(form.category_id),
      status: form.status,
    };
    if (form.email.trim()) payload.email = form.email.trim();
    if (form.sub_category_id)
      payload.sub_category_id = Number(form.sub_category_id);
    if (form.notes.trim()) payload.notes = form.notes.trim();

    try {
      if (isEdit && worker) {
        await updateWorker({ id: worker.id, ...payload }).unwrap();
        toast.success("Worker updated");
      } else {
        await createWorker(payload).unwrap();
        toast.success("Worker added");
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
          <SheetTitle>{isEdit ? "Edit worker" : "Add worker"}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update this worker's details."
              : "Create a worker record that orders can be assigned to."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-4">
          <Field label="Name" required>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Full name"
            />
          </Field>

          <Field label="Phone" required>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="03001234567"
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="worker@example.com"
            />
          </Field>

          <Field label="Category" required>
            <select
              value={form.category_id}
              onChange={(e) => {
                set("category_id", e.target.value);
                set("sub_category_id", ""); // reset sub-category on category change
              }}
              className={fieldClass}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Sub-category">
            <select
              value={form.sub_category_id}
              onChange={(e) => set("sub_category_id", e.target.value)}
              disabled={!form.category_id || subCategories.length === 0}
              className={fieldClass}
            >
              <option value="">
                {subCategories.length ? "None" : "No sub-categories"}
              </option>
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className={fieldClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={3}
              placeholder="Optional notes"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
          </Field>
        </div>

        <SheetFooter>
          <Button disabled={!canSubmit} onClick={handleSubmit}>
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {isEdit ? "Save changes" : "Add worker"}
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
