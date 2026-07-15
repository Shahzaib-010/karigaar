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
import type {
  Category,
  CategoryInput,
  PriceCategory,
  PriceCategoryInput,
  SubCategory,
  SubCategoryInput,
} from "@/src/lib/api";
import {
  useCreateCategoryMutation,
  useCreatePriceCategoryMutation,
  useCreateSubCategoryMutation,
  useUpdateCategoryMutation,
  useUpdatePriceCategoryMutation,
  useUpdateSubCategoryMutation,
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

const fieldClass =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40";

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

function FormShell({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  canSubmit,
  busy,
  onSubmit,
  trigger,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  submitLabel: string;
  canSubmit: boolean;
  busy: boolean;
  onSubmit: () => void;
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto px-4">{children}</div>
        <SheetFooter>
          <Button disabled={!canSubmit} onClick={onSubmit}>
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : null}
            {submitLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ── Category ────────────────────────────────────────────────────────── */

export function CategoryFormSheet({
  category,
  trigger,
}: {
  category?: Category;
  trigger: ReactNode;
}) {
  const isEdit = Boolean(category);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState(true);

  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const busy = creating || updating;

  function handleOpenChange(next: boolean) {
    if (next) {
      setName(category?.name ?? "");
      setDescription(category?.description ?? "");
      setBasePrice(category?.base_price != null ? String(category.base_price) : "");
      setStatus(category ? (category.status ?? false) : true);
    }
    setOpen(next);
  }

  const canSubmit = Boolean(name.trim()) && !busy;

  async function onSubmit() {
    if (!canSubmit) return;
    const payload: CategoryInput = { name: name.trim(), status };
    if (description.trim()) payload.description = description.trim();
    if (basePrice.trim() !== "") payload.base_price = Number(basePrice);
    try {
      if (isEdit && category) {
        await updateCategory({ id: category.id, ...payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <FormShell
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit category" : "Add category"}
      description="A top-level service category."
      submitLabel={isEdit ? "Save changes" : "Add category"}
      canSubmit={canSubmit}
      busy={busy}
      onSubmit={onSubmit}
      trigger={trigger}
    >
      <Field label="Name" required>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
      </Field>
      <Field label="Base price">
        <Input
          type="number"
          min={0}
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          placeholder="e.g. 500"
        />
      </Field>
      <label className="flex items-center justify-between">
        <span className="text-sm font-medium">Active</span>
        <Switch checked={status} onCheckedChange={setStatus} />
      </label>
    </FormShell>
  );
}

/* ── Sub-category ────────────────────────────────────────────────────── */

export function SubCategoryFormSheet({
  subCategory,
  categories,
  trigger,
}: {
  subCategory?: SubCategory;
  categories: Category[];
  trigger: ReactNode;
}) {
  const isEdit = Boolean(subCategory);
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);

  const [createSub, { isLoading: creating }] = useCreateSubCategoryMutation();
  const [updateSub, { isLoading: updating }] = useUpdateSubCategoryMutation();
  const busy = creating || updating;

  function handleOpenChange(next: boolean) {
    if (next) {
      setCategoryId(subCategory?.category_id ? String(subCategory.category_id) : "");
      setTitle(subCategory?.title ?? "");
      setDescription(subCategory?.description ?? "");
      setStatus(subCategory ? (subCategory.status ?? false) : true);
    }
    setOpen(next);
  }

  const canSubmit = Boolean(categoryId && title.trim()) && !busy;

  async function onSubmit() {
    if (!canSubmit) return;
    const payload: SubCategoryInput = {
      category_id: Number(categoryId),
      title: title.trim(),
      status,
    };
    if (description.trim()) payload.description = description.trim();
    try {
      if (isEdit && subCategory) {
        await updateSub({ id: subCategory.id, ...payload }).unwrap();
        toast.success("Sub-category updated");
      } else {
        await createSub(payload).unwrap();
        toast.success("Sub-category created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <FormShell
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit sub-category" : "Add sub-category"}
      description="A service under a category."
      submitLabel={isEdit ? "Save changes" : "Add sub-category"}
      canSubmit={canSubmit}
      busy={busy}
      onSubmit={onSubmit}
      trigger={trigger}
    >
      <Field label="Category" required>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
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
      <Field label="Title" required>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
        />
      </Field>
      <label className="flex items-center justify-between">
        <span className="text-sm font-medium">Active</span>
        <Switch checked={status} onCheckedChange={setStatus} />
      </label>
    </FormShell>
  );
}

/* ── Price-category ──────────────────────────────────────────────────── */

export function PriceCategoryFormSheet({
  priceCategory,
  subCategories,
  trigger,
}: {
  priceCategory?: PriceCategory;
  subCategories: SubCategory[];
  trigger: ReactNode;
}) {
  const isEdit = Boolean(priceCategory);
  const [open, setOpen] = useState(false);
  const [subCategoryId, setSubCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [jobType, setJobType] = useState("");
  const [duration, setDuration] = useState("");
  const [complexity, setComplexity] = useState("");

  const [createPrice, { isLoading: creating }] =
    useCreatePriceCategoryMutation();
  const [updatePrice, { isLoading: updating }] =
    useUpdatePriceCategoryMutation();
  const busy = creating || updating;

  function handleOpenChange(next: boolean) {
    if (next) {
      const sid =
        priceCategory?.sub_category_id ?? priceCategory?.sub_category?.id;
      setSubCategoryId(sid ? String(sid) : "");
      setPrice(priceCategory?.price != null ? String(priceCategory.price) : "");
      setJobType(priceCategory?.job_type ?? "");
      setDuration(priceCategory?.duration ?? "");
      setComplexity(priceCategory?.complexity ?? "");
    }
    setOpen(next);
  }

  const priceNum = Number(price);
  const canSubmit =
    Boolean(subCategoryId && price.trim() !== "" && priceNum > 0) && !busy;

  async function onSubmit() {
    if (!canSubmit) return;
    const payload: PriceCategoryInput = {
      sub_category_id: Number(subCategoryId),
      price: priceNum,
    };
    if (jobType.trim()) payload.job_type = jobType.trim();
    if (duration.trim()) payload.duration = duration.trim();
    if (complexity.trim()) payload.complexity = complexity.trim();
    try {
      if (isEdit && priceCategory) {
        await updatePrice({ id: priceCategory.id, ...payload }).unwrap();
        toast.success("Price plan updated");
      } else {
        await createPrice(payload).unwrap();
        toast.success("Price plan created");
      }
      setOpen(false);
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <FormShell
      open={open}
      onOpenChange={handleOpenChange}
      title={isEdit ? "Edit price plan" : "Add price plan"}
      description="A bookable price point under a sub-category."
      submitLabel={isEdit ? "Save changes" : "Add price plan"}
      canSubmit={canSubmit}
      busy={busy}
      onSubmit={onSubmit}
      trigger={trigger}
    >
      <Field label="Sub-category" required>
        <select
          value={subCategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select a sub-category</option>
          {subCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Price" required>
        <Input
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 1500"
        />
      </Field>
      <Field label="Job type">
        <Input
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          placeholder="e.g. basic"
        />
      </Field>
      <Field label="Duration">
        <Input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 2 hours"
        />
      </Field>
      <Field label="Complexity">
        <Input
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
          placeholder="e.g. standard"
        />
      </Field>
    </FormShell>
  );
}
