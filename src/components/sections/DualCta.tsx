"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, Search, UserPlus } from "lucide-react";

export default function DualCta() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        needTitle: "کچھ ٹھیک کروانا ہے؟",
        needBody: "ابھی اپنا کاریگر تلاش کریں - تیز، محفوظ اور سستا۔ نہ سودے بازی، نہ اندازے۔",
        needButton: "کاریگر تلاش کریں",
        workTitle: "مزید کام چاہیے؟",
        workBody: "کاریگر میں شامل ہوں اور اپنے گھر کے قریب کام حاصل کریں۔ اپنی مرضی کے شیڈول پر آمدنی بڑھائیں۔",
        workButton: "کاریگر کے طور پر رجسٹر کریں",
      }
    : null;

  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-[1.75rem] bg-[#edf8f4] p-7 ring-1 ring-[color-mix(in_srgb,var(--primary)_14%,white)] sm:p-9 lg:p-10">
          <div className="flex min-h-[280px] flex-col justify-between gap-10">
            <div>
              <h2 className="font-karigaar text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl">
                {copy?.needTitle ?? "Need Something Fixed?"}
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#315f55] sm:text-lg">
                {copy?.needBody ?? "Find your worker right now — fast, safe, and affordable. No haggling, no guessing."}
              </p>
            </div>

            <Link
              href={`/${locale}/workers`}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)] sm:w-fit"
            >
              <Search className="size-4" strokeWidth={2} aria-hidden />
              {copy?.needButton ?? "Find a Worker"}
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </article>

        <article className="rounded-[1.75rem] bg-[var(--primary)] p-7 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:p-9 lg:p-10">
          <div className="flex min-h-[280px] flex-col justify-between gap-10">
            <div>
              <h2 className="font-karigaar text-4xl font-bold leading-tight sm:text-5xl">
                {copy?.workTitle ?? "Want More Work?"}
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-white/75 sm:text-lg">
                {copy?.workBody ?? "Join Karigaar and get jobs near your home. Grow your income on your own schedule."}
              </p>
            </div>

            <Link
              href={`/${locale}/signup`}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-6 text-base font-bold text-[var(--primary)] shadow-sm transition-opacity hover:opacity-90 sm:w-fit"
            >
              <UserPlus className="size-4" strokeWidth={2} aria-hidden />
              {copy?.workButton ?? "Register as a Worker"}
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
