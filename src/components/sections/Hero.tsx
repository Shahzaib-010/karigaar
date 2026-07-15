"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Check,
  Hammer,
  HardHat,
  MapPin,
  Paintbrush,
  Search,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categories: { slug: string; icon: LucideIcon; label: string }[] = [
  { slug: "plumber", icon: Wrench, label: "Plumber" },
  { slug: "electrician", icon: Zap, label: "Electrician" },
  { slug: "carpenter", icon: Hammer, label: "Carpenter" },
  { slug: "painter", icon: Paintbrush, label: "Painter" },
  { slug: "ac-repair", icon: Wind, label: "AC Repair" },
  { slug: "mason", icon: HardHat, label: "Mason" },
];

const trustItems = [
  "2,400+ verified workers",
  "18 cities",
  "Rated by real customers",
];

export default function Hero() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        eyebrow: "پاکستان کا نمبر 1 ہنر مند کاریگر پلیٹ فارم",
        title: "آپ کا کاریگر،",
        titleAccent: "آپ کے دروازے پر",
        body:
          "گھر میں جو بھی کام درست کرنا ہو، ہم تربیت یافتہ اور تصدیق شدہ کاریگر آپ کے دروازے تک بھیجتے ہیں۔ تیز، محفوظ اور سستا۔",
        placeholder: "آپ کو کون سا کام چاہیے؟ مثلاً پلمبر، الیکٹریشن...",
        city: "اپنا شہر منتخب کریں",
        search: "تلاش کریں",
        categories: ["پلمبر", "الیکٹریشن", "بڑھئی", "رنگ ساز", "اے سی مرمت", "مستری"],
        trust: ["2,400+ تصدیق شدہ کاریگر", "18 شہر", "حقیقی صارفین کی درجہ بندی"],
      }
    : null;

  return (
    <section className="flex flex-1 bg-[#f7faf9] font-sans text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-7xl items-center px-4 py-12 sm:min-h-[calc(100vh-128px)] sm:px-6 sm:py-16 lg:min-h-[calc(100vh-80px)] lg:px-8 lg:py-20">
        <div className="mx-auto w-full text-center">
          {/* <p className="mb-4 inline-flex max-w-full rounded-full border border-[color-mix(in_srgb,var(--primary)_18%,white)] bg-white px-3.5 py-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--primary)] shadow-sm sm:mb-5 sm:px-4 sm:text-xs sm:tracking-[0.18em]">
            {copy?.eyebrow ?? "Pakistan&apos;s #1 Skilled Worker Platform"}
          </p> */}

          <h1 className="font-karigaar mx-auto max-w-4xl text-[2.75rem] font-bold leading-[1.02] text-slate-950 min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
            {copy?.title ?? "Your Karigaar,"}
            <span className="block text-[var(--primary)]">{copy?.titleAccent ?? "At Your Door"}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
            {copy?.body ?? "Whatever needs fixing at home, we send trained, verified workers straight to your doorstep. Fast, safe, and affordable."}
          </p>

          <form className="mt-7 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:mt-9">
            <div className="grid gap-2 md:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto]">
              <label className="flex min-h-14 min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-4 md:col-span-2 xl:col-span-1">
                <Search
                  className="size-5 shrink-0 text-slate-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  type="search"
                  placeholder={copy?.placeholder ?? "What work do you need? "}
                  className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <button
                type="button"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] md:justify-start"
              >
                <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                {copy?.city ?? "Lake City, Lahore"}
              </button>

              <button
                type="submit"
                className="min-h-14 rounded-xl bg-[var(--primary)] px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                {copy?.search ?? "Search"}
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-2.5">
            {categories.map((category, index) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.slug}
                  href={`/${locale}/services`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:px-4 sm:py-2.5 sm:text-sm"
                >
                  <Icon
                    className="size-4 shrink-0 text-[var(--primary)]"
                    strokeWidth={2}
                    aria-hidden
                  />
                  {isUrdu ? copy?.categories[index] ?? category.label : category.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500 sm:gap-x-5 sm:text-sm">
            {(isUrdu ? copy?.trust ?? trustItems : trustItems).map((item) => (
              <span key={item} className="flex items-center gap-2">
                <Check
                  className="size-4 shrink-0 text-[var(--primary)]"
                  strokeWidth={2.5}
                  aria-hidden
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
