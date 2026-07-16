"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight, CalendarCheck } from "lucide-react";

export default function DualCta() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        title: "کچھ ٹھیک کروانا ہے؟",
        body: "ابھی اپنی خدمت بک کریں - ہم ایک تربیت یافتہ، تصدیق شدہ ماہر آپ کے دروازے پر بھیجتے ہیں۔ تیز، محفوظ اور سستا۔",
        button: "خدمت بک کریں",
      }
    : null;

  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="rounded-[1.75rem] bg-[var(--primary)] p-8 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:p-12 lg:p-16">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="font-karigaar text-4xl font-bold leading-tight sm:text-5xl">
              {copy?.title ?? "Need Something Fixed?"}
            </h2>
            <p className="max-w-2xl text-base font-semibold leading-7 text-white/80 sm:text-lg">
              {copy?.body ??
                "Book your service now — we send a trained, verified professional to your door. Fast, safe, and affordable."}
            </p>
            <Link
              href={`/${locale}/services`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-7 text-base font-bold text-[var(--primary)] shadow-sm transition-opacity hover:opacity-90"
            >
              <CalendarCheck className="size-5" strokeWidth={2} aria-hidden />
              {copy?.button ?? "Book a Service"}
              <ArrowRight className="size-4" strokeWidth={2} aria-hidden />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
