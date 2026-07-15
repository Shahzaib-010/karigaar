"use client";

import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";

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
import ConfirmDeleteButton from "@/src/components/admin/ConfirmDeleteButton";
import {
  CategoryFormSheet,
  PriceCategoryFormSheet,
  SubCategoryFormSheet,
} from "@/src/components/admin/catalog-forms";
import { formatPkr } from "@/src/lib/format";
import { cn } from "@/lib/utils";
import type { AppQueryError } from "@/src/store/baseQuery";
import {
  useDeleteCategoryMutation,
  useDeletePriceCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetCategoriesQuery,
  useGetPriceCategoriesQuery,
  useGetSubCategoriesQuery,
} from "@/src/store/adminApi";

type Tab = "categories" | "subcategories" | "pricing";

const TABS: { value: Tab; label: string }[] = [
  { value: "categories", label: "Categories" },
  { value: "subcategories", label: "Sub-categories" },
  { value: "pricing", label: "Pricing" },
];

export default function AdminCatalogPage() {
  const [tab, setTab] = useState<Tab>("categories");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Catalog</h1>
        <p className="text-sm text-muted-foreground">
          Categories, sub-categories and the bookable price plans.
        </p>
      </div>

      <div className="inline-flex rounded-lg border bg-muted/40 p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "categories" ? <CategoriesTab /> : null}
      {tab === "subcategories" ? <SubCategoriesTab /> : null}
      {tab === "pricing" ? <PricingTab /> : null}
    </div>
  );
}

function ActiveBadge({ active }: { active?: boolean }) {
  return active ? (
    <Badge
      variant="outline"
      className="border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
    >
      Active
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="border-transparent bg-muted text-muted-foreground"
    >
      Inactive
    </Badge>
  );
}

function deleteErr(e: unknown, fallback: string) {
  return e && typeof e === "object" && "message" in e
    ? String((e as { message: unknown }).message)
    : fallback;
}

/** Card wrapper that renders loading / error / empty / table states. */
function TableCard({
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  emptyLabel,
  children,
}: {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  isEmpty: boolean;
  emptyLabel: string;
  children: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        {isError ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <p className="text-sm font-medium text-destructive">
              {(error as AppQueryError | undefined)?.message ??
                "Could not load."}
            </p>
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-md" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-muted-foreground">{title}</h2>
      {action}
    </div>
  );
}

/* ── Categories ──────────────────────────────────────────────────────── */

function CategoriesTab() {
  const { data = [], isLoading, isError, error, refetch } =
    useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  return (
    <div className="space-y-3">
      <SectionHeader
        title={`${data.length} categories`}
        action={
          <CategoryFormSheet
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add category
              </Button>
            }
          />
        }
      />
      <TableCard
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={data.length === 0}
        emptyLabel="No categories yet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Base price</TableHead>
              <TableHead className="text-right">Sub-categories</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.base_price != null ? formatPkr(c.base_price) : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {c.sub_categories?.length ?? 0}
                </TableCell>
                <TableCell>
                  <ActiveBadge active={c.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <CategoryFormSheet
                      category={c}
                      trigger={
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <ConfirmDeleteButton
                      title={`Delete ${c.name}?`}
                      description="Its sub-categories are not removed automatically and will be left orphaned. This can't be undone."
                      onConfirm={async () => {
                        try {
                          await deleteCategory(c.id).unwrap();
                          toast.success("Category deleted");
                        } catch (e) {
                          toast.error(
                            deleteErr(e, "Could not delete category."),
                          );
                        }
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}

/* ── Sub-categories ──────────────────────────────────────────────────── */

function SubCategoriesTab() {
  const { data = [], isLoading, isError, error, refetch } =
    useGetSubCategoriesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [deleteSub] = useDeleteSubCategoryMutation();

  const categoryName = (id?: number) =>
    categories.find((c) => c.id === id)?.name ?? "—";

  return (
    <div className="space-y-3">
      <SectionHeader
        title={`${data.length} sub-categories`}
        action={
          <SubCategoryFormSheet
            categories={categories}
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add sub-category
              </Button>
            }
          />
        }
      />
      <TableCard
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={data.length === 0}
        emptyLabel="No sub-categories yet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price plans</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.title}</TableCell>
                <TableCell>{categoryName(s.category_id)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {s.category_pricings?.length ?? 0}
                </TableCell>
                <TableCell>
                  <ActiveBadge active={s.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <SubCategoryFormSheet
                      subCategory={s}
                      categories={categories}
                      trigger={
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <ConfirmDeleteButton
                      title={`Delete ${s.title}?`}
                      description="This can't be undone."
                      onConfirm={async () => {
                        try {
                          await deleteSub(s.id).unwrap();
                          toast.success("Sub-category deleted");
                        } catch (e) {
                          toast.error(
                            deleteErr(e, "Could not delete sub-category."),
                          );
                        }
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}

/* ── Pricing ─────────────────────────────────────────────────────────── */

function PricingTab() {
  const { data = [], isLoading, isError, error, refetch } =
    useGetPriceCategoriesQuery();
  const { data: subCategories = [] } = useGetSubCategoriesQuery();
  const [deletePrice] = useDeletePriceCategoryMutation();

  const subTitle = (p: (typeof data)[number]) =>
    p.sub_category?.title ??
    subCategories.find((s) => s.id === p.sub_category_id)?.title ??
    "—";

  return (
    <div className="space-y-3">
      <SectionHeader
        title={`${data.length} price plans`}
        action={
          <PriceCategoryFormSheet
            subCategories={subCategories}
            trigger={
              <Button size="sm">
                <PlusIcon className="size-4" />
                Add price plan
              </Button>
            }
          />
        }
      />
      <TableCard
        isLoading={isLoading}
        isError={isError}
        error={error}
        onRetry={refetch}
        isEmpty={data.length === 0}
        emptyLabel="No price plans yet."
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sub-category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Job type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Complexity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{subTitle(p)}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatPkr(p.price)}
                </TableCell>
                <TableCell>{p.job_type ?? "—"}</TableCell>
                <TableCell>{p.duration ?? "—"}</TableCell>
                <TableCell>{p.complexity ?? "—"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <PriceCategoryFormSheet
                      priceCategory={p}
                      subCategories={subCategories}
                      trigger={
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      }
                    />
                    <ConfirmDeleteButton
                      title="Delete this price plan?"
                      description="This can't be undone."
                      onConfirm={async () => {
                        try {
                          await deletePrice(p.id).unwrap();
                          toast.success("Price plan deleted");
                        } catch (e) {
                          toast.error(
                            deleteErr(e, "Could not delete price plan."),
                          );
                        }
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}
