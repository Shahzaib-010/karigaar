"use client";

import Link from "next/link";
import {
  ArrowRight,
  ClockIcon,
  GaugeIcon,
  RefreshCwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { formatPkr } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetCatalogQuery } from "@/src/store/clientApi";

const active = (status?: boolean) => status !== false;

export default function ServicesBrowse({ locale }: { locale: string }) {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCatalogQuery();

  // Signed-out users can browse; clicking Book routes them through login first.
  const bookHref = (planId: number) => {
    const target = `/${locale}/book/${planId}`;
    return isAuthenticated
      ? target
      : `/${locale}/login?next=${encodeURIComponent(target)}`;
  };

  const categories = (data ?? [])
    .filter((c) => active(c.status))
    .map((c) => ({
      ...c,
      sub_categories: (c.sub_categories ?? []).filter(
        (s) => active(s.status) && (s.category_pricings?.length ?? 0) > 0,
      ),
    }))
    .filter((c) => c.sub_categories.length > 0);

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero band */}
        <header className="relative overflow-hidden rounded-3xl bg-[var(--primary)] px-6 py-10 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:px-10 sm:py-12">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
              Home services
            </p>
            <h1 className="font-karigaar mt-2 text-3xl font-bold leading-tight sm:text-5xl">
              Book a trusted professional
            </h1>
            <p className="mt-3 text-base font-medium text-white/80 sm:text-lg">
              Choose a service and a plan — we assign a verified professional and
              handle the rest.
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

        <div className="mt-8 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Browse services
          </h2>
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
            <div className="space-y-10">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-8 w-56" />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-52 rounded-2xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-sm text-muted-foreground">
                No services are available right now. Please check back soon.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-12">
              {categories.map((category) => (
                <section key={category.id} className="scroll-mt-24">
                  <div className="mb-6 border-l-4 border-[var(--primary)] pl-4">
                    <h2 className="font-karigaar text-2xl font-bold text-slate-950 sm:text-3xl">
                      {category.name}
                    </h2>
                    {category.description ? (
                      <p className="mt-1 max-w-2xl text-sm text-slate-600">
                        {category.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-8">
                    {category.sub_categories.map((sub) => (
                      <div key={sub.id}>
                        <div className="mb-4 flex items-center gap-3">
                          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                            {sub.title}
                          </h3>
                          <span className="h-px flex-1 bg-slate-200" />
                        </div>
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
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    per booking
                                  </p>
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

                                <Button
                                  asChild
                                  className="mt-auto w-full rounded-xl"
                                >
                                  <Link href={bookHref(plan.id)}>
                                    Book now
                                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                                  </Link>
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
