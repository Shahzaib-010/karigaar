"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeftIcon,
  ArrowRight,
  ChevronRightIcon,
  ClockIcon,
  DropletsIcon,
  GaugeIcon,
  HammerIcon,
  LeafIcon,
  PaintRollerIcon,
  PlugIcon,
  RefreshCwIcon,
  SparklesIcon,
  WindIcon,
  WrenchIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { formatPkr, toNumber } from "@/src/lib/format";
import { cn } from "@/lib/utils";
import type { Category, SubCategory } from "@/src/lib/api";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetCatalogQuery } from "@/src/store/clientApi";

const active = (status?: boolean) => status !== false;

// Decorative-only: no icon/colour field on categories, so we cycle a curated set
// by index purely for visual variety.
const CAT_ICONS: LucideIcon[] = [
  WrenchIcon,
  PlugIcon,
  PaintRollerIcon,
  DropletsIcon,
  SparklesIcon,
  LeafIcon,
  WindIcon,
  HammerIcon,
];
const CAT_COLORS = [
  "#096C44",
  "#0EA5E9",
  "#8B5CF6",
  "#F59E0B",
  "#F43F5E",
  "#14B8A6",
  "#6366F1",
  "#0F766E",
];

const minPlanPrice = (sub: SubCategory) =>
  Math.min(...(sub.category_pricings ?? []).map((p) => toNumber(p.price)));

const minCategoryPrice = (cat: Category) =>
  Math.min(
    ...(cat.sub_categories ?? []).flatMap((s) =>
      (s.category_pricings ?? []).map((p) => toNumber(p.price)),
    ),
  );

const ease = [0.22, 1, 0.36, 1] as const;

export default function ServicesBrowse({ locale }: { locale: string }) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCatalogQuery();

  const [catId, setCatId] = useState<number | null>(null);
  const [subId, setSubId] = useState<number | null>(null);

  // Signed-out users can browse; clicking Book routes them through login first.
  const bookHref = (planId: number) => {
    const target = `/${locale}/book/${planId}`;
    return isAuthenticated
      ? target
      : `/${locale}/login?next=${encodeURIComponent(target)}`;
  };

  const categories = useMemo(
    () =>
      (data ?? [])
        .filter((c) => active(c.status))
        .map((c) => ({
          ...c,
          sub_categories: (c.sub_categories ?? []).filter(
            (s) => active(s.status) && (s.category_pricings?.length ?? 0) > 0,
          ),
        }))
        .filter((c) => c.sub_categories.length > 0),
    [data],
  );

  const category = catId != null ? categories.find((c) => c.id === catId) ?? null : null;
  const sub =
    category && subId != null
      ? category.sub_categories.find((s) => s.id === subId) ?? null
      : null;
  const level: "cats" | "subs" | "plans" = sub ? "plans" : category ? "subs" : "cats";

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Hero band */}
        <header className="relative overflow-hidden rounded-3xl bg-[var(--primary)] px-6 py-9 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:px-10 sm:py-11">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Home services
            </p>
            <h1 className="font-karigaar mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Book a trusted professional
            </h1>
            <p className="mt-3 text-sm font-medium text-white/80 sm:text-base">
              Pick a category, choose the service you need, and we&apos;ll assign a
              verified professional.
            </p>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 right-24 size-56 rounded-full bg-white/5"
          />
        </header>

        {/* Breadcrumb + refresh */}
        <div className="mt-7 flex items-center justify-between gap-3">
          <nav className="flex min-w-0 items-center gap-1.5 text-sm">
            <Crumb
              label="All services"
              onClick={() => {
                setCatId(null);
                setSubId(null);
              }}
              active={level === "cats"}
            />
            {category ? (
              <>
                <ChevronRightIcon className="size-4 shrink-0 text-slate-400" />
                <Crumb
                  label={category.name}
                  onClick={() => setSubId(null)}
                  active={level === "subs"}
                />
              </>
            ) : null}
            {sub ? (
              <>
                <ChevronRightIcon className="size-4 shrink-0 text-slate-400" />
                <Crumb label={sub.title} active />
              </>
            ) : null}
          </nav>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="shrink-0 rounded-full"
          >
            <RefreshCwIcon className={isFetching ? "size-4 animate-spin" : "size-4"} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        <div className="mt-5">
          {isError ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-sm font-medium text-destructive">
                  {(error as AppQueryError | undefined)?.message ??
                    "Could not load services."}
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded-2xl" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No services are available right now. Please check back soon.
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence mode="wait">
              {/* ── Level 1: categories ─────────────────────────── */}
              {level === "cats" ? (
                <ViewShell key="cats">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat, i) => {
                      const Icon = CAT_ICONS[i % CAT_ICONS.length];
                      const color = CAT_COLORS[i % CAT_COLORS.length];
                      return (
                        <DrillCard
                          key={cat.id}
                          onClick={() => {
                            setCatId(cat.id);
                            setSubId(null);
                          }}
                          icon={Icon}
                          color={color}
                          title={cat.name}
                          description={cat.description}
                          countLabel={`${cat.sub_categories.length} ${
                            cat.sub_categories.length === 1 ? "service" : "services"
                          }`}
                          fromPrice={minCategoryPrice(cat)}
                        />
                      );
                    })}
                  </div>
                </ViewShell>
              ) : null}

              {/* ── Level 2: sub-categories ─────────────────────── */}
              {level === "subs" && category ? (
                <ViewShell key={`subs-${category.id}`}>
                  <SectionHead
                    title={category.name}
                    subtitle={category.description}
                    onBack={() => {
                      setCatId(null);
                      setSubId(null);
                    }}
                  />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {category.sub_categories.map((s, i) => {
                      const Icon = CAT_ICONS[(i + 2) % CAT_ICONS.length];
                      const color = CAT_COLORS[(i + 2) % CAT_COLORS.length];
                      const plans = s.category_pricings ?? [];
                      return (
                        <DrillCard
                          key={s.id}
                          onClick={() => setSubId(s.id)}
                          icon={Icon}
                          color={color}
                          title={s.title}
                          description={s.description}
                          countLabel={`${plans.length} ${
                            plans.length === 1 ? "plan" : "plans"
                          }`}
                          fromPrice={minPlanPrice(s)}
                        />
                      );
                    })}
                  </div>
                </ViewShell>
              ) : null}

              {/* ── Level 3: plans ──────────────────────────────── */}
              {level === "plans" && sub ? (
                <ViewShell key={`plans-${sub.id}`}>
                  <SectionHead
                    title={sub.title}
                    subtitle={sub.description}
                    onBack={() => setSubId(null)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {(sub.category_pricings ?? []).map((plan) => (
                      <Card
                        key={plan.id}
                        className="group flex flex-col rounded-2xl border-slate-200 shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_18px_45px_rgba(1,73,62,0.12)]"
                      >
                        <CardContent className="flex flex-1 flex-col gap-4 p-5">
                          <span className="w-fit rounded-full bg-[#E6F4EF] px-3 py-1 text-xs font-bold capitalize text-[var(--primary)]">
                            {plan.job_type || "Standard"}
                          </span>

                          <div>
                            <p className="text-3xl font-bold text-slate-950">
                              {formatPkr(plan.price)}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">per booking</p>
                          </div>

                          {plan.duration || plan.complexity ? (
                            <div className="flex flex-wrap gap-2">
                              {plan.duration ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                                  <ClockIcon className="size-3.5" />
                                  {plan.duration}
                                </span>
                              ) : null}
                              {plan.complexity ? (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                                  <GaugeIcon className="size-3.5" />
                                  {plan.complexity}
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          <Button asChild className="mt-auto w-full rounded-xl">
                            <Link href={bookHref(plan.id)}>
                              Book now
                              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ViewShell>
              ) : null}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}

/* ── Pieces ──────────────────────────────────────────────────────── */

function ViewShell({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease }}
    >
      {children}
    </motion.div>
  );
}

function Crumb({
  label,
  onClick,
  active = false,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  if (active || !onClick) {
    return (
      <span className="truncate font-semibold text-slate-900">{label}</span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="truncate font-medium text-slate-500 transition-colors hover:text-[var(--primary)]"
    >
      {label}
    </button>
  );
}

function SectionHead({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string | null;
  onBack: () => void;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        <ArrowLeftIcon className="size-4" />
      </button>
      <div className="min-w-0">
        <h2 className="font-karigaar text-2xl font-bold text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm text-slate-600">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function DrillCard({
  icon: Icon,
  color,
  title,
  description,
  countLabel,
  fromPrice,
  onClick,
}: {
  icon: LucideIcon;
  color: string;
  title: string;
  description?: string | null;
  countLabel: string;
  fromPrice: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all",
        "hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[0_18px_45px_rgba(1,73,62,0.12)]",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex size-12 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${color}1f`, color }}
        >
          <Icon className="size-6" />
        </span>
        <span className="flex size-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white">
          <ChevronRightIcon className="size-4" />
        </span>
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-slate-950">{title}</h3>
        {description ? (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {countLabel}
        </span>
        <span className="text-sm text-slate-500">
          from{" "}
          <span className="font-bold text-slate-950">{formatPkr(fromPrice)}</span>
        </span>
      </div>
    </button>
  );
}
