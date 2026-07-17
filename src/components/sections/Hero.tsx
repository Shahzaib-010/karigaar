"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Check, Search } from "lucide-react";

import { categoryIcon } from "@/src/lib/categoryVisuals";
import { useGetCatalogQuery } from "@/src/store/clientApi";

const active = (status?: boolean) => status !== false;

export default function Hero() {
  const locale = useLocale();
  const router = useRouter();
  const isUrdu = locale === "ur";
  const { data } = useGetCatalogQuery();

  const [query, setQuery] = useState("");

  const categories = (data ?? [])
    .filter((c) => active(c.status))
    .map((c) => ({
      ...c,
      sub_categories: (c.sub_categories ?? []).filter(
        (s) => active(s.status) && (s.category_pricings?.length ?? 0) > 0,
      ),
    }))
    .filter((c) => c.sub_categories.length > 0);

  const q = query.trim().toLowerCase();
  const matches = q
    ? categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5)
    : [];

  function goTo(categoryId?: number) {
    const base = `/${locale}/services`;
    router.push(categoryId ? `${base}?category=${categoryId}` : base);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    goTo(matches[0]?.id);
  }

  const copy = isUrdu
    ? {
        title: "آپ کا کاریگر،",
        titleAccent: "آپ کے دروازے پر",
        body:
          "گھر میں جو بھی کام درست کرنا ہو، ہم تربیت یافتہ اور تصدیق شدہ کاریگر آپ کے دروازے تک بھیجتے ہیں۔ تیز، محفوظ اور سستا۔",
        placeholder: "آپ کو کون سی خدمت چاہیے؟",
        search: "تلاش کریں",
        trust: [
          "تصدیق شدہ ماہرین",
          "پہلے سے طے شدہ قیمت",
          "ہر کام کے بعد ریٹنگ",
        ],
      }
    : {
        title: "Your Karigaar,",
        titleAccent: "At Your Door",
        body:
          "Whatever needs fixing at home, we send trained, verified professionals straight to your doorstep. Fast, safe, and affordable.",
        placeholder: "What service do you need?",
        search: "Search",
        trust: [
          "Verified professionals",
          "Upfront, agreed pricing",
          "Rated after every job",
        ],
      };

  return (
    <section className="flex flex-1 bg-[#f7faf9] font-sans text-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-112px)] w-full max-w-7xl items-center px-4 py-12 sm:min-h-[calc(100vh-128px)] sm:px-6 sm:py-16 lg:min-h-[calc(100vh-80px)] lg:px-8 lg:py-20">
        <div className="mx-auto w-full text-center">
          <h1 className="font-karigaar mx-auto max-w-4xl text-[2.75rem] font-bold leading-[1.02] text-slate-950 min-[380px]:text-5xl sm:text-6xl lg:text-7xl">
            {copy.title}
            <span className="block text-[var(--primary)]">{copy.titleAccent}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 lg:text-xl">
            {copy.body}
          </p>

          <form
            onSubmit={onSubmit}
            className="relative mx-auto mt-7 max-w-2xl rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:mt-9"
          >
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <label className="flex min-h-14 min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-4">
                <Search
                  className="size-5 shrink-0 text-slate-400"
                  strokeWidth={2}
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={copy.placeholder}
                  className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <button
                type="submit"
                className="min-h-14 rounded-xl bg-[var(--primary)] px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                {copy.search}
              </button>
            </div>

            {matches.length > 0 ? (
              <div className="absolute inset-x-2 top-full z-20 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                {matches.map((c, i) => {
                  const Icon = categoryIcon(c.name, i);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => goTo(c.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                    >
                      <Icon
                        className="size-5 shrink-0 text-[var(--primary)]"
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span className="text-sm font-bold text-slate-800">
                        {c.name}
                      </span>
                      <span className="ml-auto text-xs font-semibold text-slate-400">
                        {c.sub_categories.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </form>

          {categories.length > 0 ? (
            <div className="mt-5 flex flex-wrap justify-center gap-2 sm:mt-6 sm:gap-2.5">
              {categories.slice(0, 6).map((category, i) => {
                const Icon = categoryIcon(category.name, i);
                return (
                  <Link
                    key={category.id}
                    href={`/${locale}/services?category=${category.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:px-4 sm:py-2.5 sm:text-sm"
                  >
                    <Icon
                      className="size-4 shrink-0 text-[var(--primary)]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    {category.name}
                  </Link>
                );
              })}
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs font-bold text-slate-500 sm:gap-x-5 sm:text-sm">
            {copy.trust.map((item) => (
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
