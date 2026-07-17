"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRightIcon, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { PRIMARY } from "@/src/components/admin/charts/palette";

const PANEL_SHADOW =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_28px_-16px_rgba(16,24,40,0.12)]";

/** A flat card surface — the single container primitive used across admin pages. */
export function Panel({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5",
        PANEL_SHADOW,
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Subtle fade-up entrance; stretches to fill grid cells so cards stay even. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}

/** Large hero metric; one per page may be `highlighted` (solid primary). */
export function KpiCard({
  label,
  value,
  note,
  icon: Icon,
  href,
  highlighted = false,
}: {
  label: string;
  value: ReactNode;
  note: string;
  icon: LucideIcon;
  href?: string;
  highlighted?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "group/kpi relative flex h-full flex-col justify-between gap-6 rounded-2xl border p-5 transition-shadow",
        PANEL_SHADOW,
        highlighted
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border/60 bg-card hover:shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_36px_-16px_rgba(16,24,40,0.18)]"
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full",
            highlighted ? "bg-white/15 text-primary-foreground" : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-5" />
        </span>
        {href ? (
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full border transition-colors",
              highlighted
                ? "border-white/25 text-primary-foreground group-hover/kpi:bg-white/15"
                : "border-border text-muted-foreground group-hover/kpi:bg-muted"
            )}
          >
            <ArrowUpRightIcon className="size-4" />
          </span>
        ) : null}
      </div>
      <div>
        <p className={cn("text-xs", highlighted ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {label}
        </p>
        <p className="mt-1.5 text-3xl font-semibold leading-none tracking-tight tabular-nums">
          {value}
        </p>
        <p className={cn("mt-2.5 text-xs", highlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {note}
        </p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {body}
    </Link>
  ) : (
    body
  );
}

/** Compact secondary metric: tinted icon + label + value + note. */
export function StatCard({
  icon: Icon,
  label,
  value,
  note,
  accent = PRIMARY,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  note?: string;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full items-center gap-4 rounded-2xl border border-border/60 bg-card p-5",
        PANEL_SHADOW
      )}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}1f`, color: accent }}
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-1 truncate text-xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        {note ? <p className="mt-1 truncate text-xs text-muted-foreground">{note}</p> : null}
      </div>
    </div>
  );
}

/** Tiny inline stat used inside panels (e.g. under a gauge). */
export function MiniStat({
  icon: Icon,
  label,
  value,
  color = PRIMARY,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex size-9 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}1f`, color }}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-semibold leading-none tabular-nums">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

/** Page-level header shared by all admin pages. */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
