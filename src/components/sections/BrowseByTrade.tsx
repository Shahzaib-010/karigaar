"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ChevronRightIcon } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { categoryColor, categoryIcon } from "@/src/lib/categoryVisuals";
import { formatPkr, toNumber } from "@/src/lib/format";
import type { Category } from "@/src/lib/api";
import { useGetCatalogQuery } from "@/src/store/clientApi";

const active = (status?: boolean) => status !== false;

// A live grid of the real catalog's top categories — same source and drill-in
// target as the /services page, so what's on the homepage is always what's
// actually bookable.
export default function BrowseByTrade() {
  const locale = useLocale();
  const t = useTranslations("browseByTrade");
  const isUrdu = locale === "ur";
  const { data, isLoading } = useGetCatalogQuery();

  const copy = isUrdu
    ? {
        title: "زمرے کے حساب سے تلاش کریں",
        subtitle:
          "ہر گھریلو کام کی سہولت یہاں موجود ہے - صحیح کام کے لیے صحیح ماہر تلاش کریں",
        services: "خدمات",
        from: "شروع",
      }
    : {
        title: "Browse by Trade",
        subtitle: "Every home job covered — find the right expert for the right work",
        services: "services",
        from: "from",
      };

  const categories = (data ?? [])
    .filter((c) => active(c.status))
    .map((c) => ({
      ...c,
      sub_categories: (c.sub_categories ?? []).filter(
        (s) => active(s.status) && (s.category_pricings?.length ?? 0) > 0,
      ),
    }))
    .filter((c) => c.sub_categories.length > 0)
    .slice(0, 8);

  const fromPrice = (c: Category) =>
    Math.min(
      ...(c.sub_categories ?? []).flatMap((s) =>
        (s.category_pricings ?? []).map((p) => toNumber(p.price)),
      ),
    );

  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            {copy.subtitle}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-10 text-center text-sm font-semibold text-slate-500">
            Services are being added — check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category, i) => {
              const Icon = categoryIcon(category.name, i);
              const color = categoryColor(i);
              return (
                <Link
                  key={category.id}
                  href={`/${locale}/services?category=${category.id}`}
                  className="group relative flex min-h-52 flex-col rounded-2xl border border-slate-200 bg-[#f7faf9] p-5 transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_45px_rgba(1,73,62,0.12)]"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className="flex size-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: `${color}1f`, color }}
                      aria-hidden
                    >
                      <Icon className="size-6" strokeWidth={2} />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                      {category.sub_categories.length} {copy.services}
                    </span>
                  </div>

                  <div className="mt-6 flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {category.name}
                    </h3>
                    {category.description ? (
                      <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                        {category.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-4">
                    <span className="text-sm font-semibold text-slate-500">
                      {copy.from}{" "}
                      <span className="font-bold text-slate-900">
                        {formatPkr(fromPrice(category))}
                      </span>
                    </span>
                    <span className="flex size-7 items-center justify-center rounded-full text-primary transition-transform group-hover:translate-x-0.5">
                      <ChevronRightIcon className="size-4" strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-9 text-center">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-1.5 text-base font-bold text-primary transition-opacity hover:opacity-75"
          >
            {t("viewAll")}
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
