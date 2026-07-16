"use client";

import Link from "next/link";
import { ArrowRight, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPkr } from "@/src/lib/format";
import type { AppQueryError } from "@/src/store/baseQuery";
import { useGetCatalogQuery } from "@/src/store/clientApi";

const active = (status?: boolean) => status !== false;

export default function ServicesBrowse({ locale }: { locale: string }) {
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetCatalogQuery();

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
        <header className="mb-8 flex items-end justify-between gap-3">
          <div>
            <h1 className="font-karigaar text-3xl font-bold text-slate-950 sm:text-4xl">
              Book a service
            </h1>
            <p className="mt-2 text-base font-medium text-slate-600">
              Pick a service and a plan — we&apos;ll assign a verified
              professional.
            </p>
          </div>
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
        </header>

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
          <div className="space-y-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-7 w-48" />
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-32 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No services are available right now. Please check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {categories.map((category) => (
              <section key={category.id}>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-950">
                    {category.name}
                  </h2>
                  {category.description ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {category.description}
                    </p>
                  ) : null}
                </div>

                <div className="space-y-6">
                  {category.sub_categories.map((sub) => (
                    <div key={sub.id}>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        {sub.title}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {(sub.category_pricings ?? []).map((plan) => (
                          <Card key={plan.id} className="flex flex-col">
                            <CardContent className="flex flex-1 flex-col gap-3">
                              <div className="flex-1">
                                <p className="text-sm font-semibold capitalize text-slate-900">
                                  {plan.job_type || "Standard"}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {[plan.complexity, plan.duration]
                                    .filter(Boolean)
                                    .join(" · ") || " "}
                                </p>
                                <p className="mt-3 text-2xl font-bold text-slate-950">
                                  {formatPkr(plan.price)}
                                </p>
                              </div>
                              <Button asChild className="w-full">
                                <Link
                                  href={`/${locale}/book/${plan.id}`}
                                >
                                  Book
                                  <ArrowRight className="size-4" />
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
    </main>
  );
}
