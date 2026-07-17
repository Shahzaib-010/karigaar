"use client";

import { useLocale } from "next-intl";
import {
  BanknoteIcon,
  CalendarClockIcon,
  ShieldCheckIcon,
  StarIcon,
  type LucideIcon,
} from "lucide-react";

// Replaces the old fabricated testimonials with honest, verifiable value props
// that mirror the real booking flow (verify → upfront price → pick a slot →
// rate). No invented names, cities, or numbers.
type Value = { icon: LucideIcon; title: string; body: string };

export default function WhyKarigaar() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const heading = isUrdu
    ? { title: "کاریگر کیوں؟", subtitle: "ہر بکنگ کے ساتھ آپ کو یہ ملتا ہے" }
    : {
        title: "Why Karigaar",
        subtitle: "What you get with every booking",
      };

  const values: Value[] = isUrdu
    ? [
        {
          icon: ShieldCheckIcon,
          title: "تصدیق شدہ ماہرین",
          body: "ہر کاریگر کی شناخت اور تجربہ جانچنے کے بعد ہی کام سونپا جاتا ہے۔",
        },
        {
          icon: BanknoteIcon,
          title: "شفاف قیمت",
          body: "قیمت پہلے سے دکھائی جاتی ہے — کوئی چھپے ہوئے چارجز نہیں۔",
        },
        {
          icon: CalendarClockIcon,
          title: "منٹوں میں بکنگ",
          body: "خدمت منتخب کریں، اپنا وقت چنیں، اور بس ہو گیا۔",
        },
        {
          icon: StarIcon,
          title: "ہر کام کے بعد ریٹنگ",
          body: "کام مکمل ہونے پر اپنے کاریگر کو ریٹ کریں — معیار برقرار رہتا ہے۔",
        },
      ]
    : [
        {
          icon: ShieldCheckIcon,
          title: "Verified professionals",
          body: "Every worker is identity- and experience-checked before any job is assigned.",
        },
        {
          icon: BanknoteIcon,
          title: "Transparent pricing",
          body: "The price is shown upfront when you book — no hidden charges, no surprises.",
        },
        {
          icon: CalendarClockIcon,
          title: "Book in minutes",
          body: "Pick a service, choose a time slot that suits you, and you're done.",
        },
        {
          icon: StarIcon,
          title: "Rated after every job",
          body: "Rate your professional once the work is complete — it keeps quality high.",
        },
      ];

  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {heading.title}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            {heading.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <article
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#E6F4EF] text-[var(--primary)]">
                  <Icon className="size-6" strokeWidth={2} aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-950">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  {value.body}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
