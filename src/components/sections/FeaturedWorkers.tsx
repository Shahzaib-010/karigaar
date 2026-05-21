"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";

import { featuredWorkers } from "@/src/data/workers";

export default function FeaturedWorkers() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        eyebrow: "آپ کے قریب ٹاپ کاریگر",
        title: "تصدیق شدہ، ریٹیڈ، اور تیار",
        subtitle: "نیچے موجود ہر کاریگر کو حقیقی صارفین نے ریٹ کیا ہے - نہ جعلی ریویوز، نہ شارٹ کٹس",
        verified: "تصدیق شدہ",
        bookNow: "ابھی بک کریں",
        seeAll: "تمام کاریگر دیکھیں",
      }
    : null;

  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
            {copy?.eyebrow ?? "Top Workers Near You"}
          </p>
          <h2 className="font-karigaar mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy?.title ?? "Verified, Rated, and Ready"}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            {copy?.subtitle ?? "Every worker below has been rated by real customers - no fake reviews, no shortcuts"}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {featuredWorkers.map((worker) => (
            <article
              key={worker.slug}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="h-16 w-16 shrink-0 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {worker.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {worker.trade} · {worker.city}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                  <BadgeCheck className="size-3.5" strokeWidth={2.5} aria-hidden />
                  {copy?.verified ?? "Verified"}
                </span>
              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-base font-bold text-slate-900">
                  <Star
                    className="size-4 fill-[#F59E0B] text-[#F59E0B]"
                    strokeWidth={0}
                    aria-hidden
                  />
                  {worker.rating}
                  <span className="text-sm font-semibold text-slate-500">
                    ({worker.jobs} jobs done)
                  </span>
                </p>
              </div>

              <Link
                href={`/${locale}/workers/${worker.slug}`}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                {copy?.bookNow ?? "Book Now"}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <Link
            href={`/${locale}/workers`}
            className="inline-flex items-center gap-1.5 text-base font-bold text-[var(--primary)] transition-opacity hover:opacity-75"
          >
            {copy?.seeAll ?? "See all workers"}
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
