"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { serviceCardLinks } from "@/src/data/services";

export default function BrowseByTrade() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const translated = isUrdu
    ? {
        title: "زمرے کے حساب سے تلاش کریں",
        subtitle: "ہر گھریلو کام کی سہولت یہاں موجود ہے - صحیح کام کے لیے صحیح ماہر تلاش کریں",
        available: "دستیاب",
        comingSoon: "جلد آ رہا ہے",
        viewAll: "تمام زمروں کو دیکھیں",
      }
    : null;

  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {translated?.title ?? "Browse by Trade"}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            {translated?.subtitle ?? "Every home job covered - find the right expert for the right work"}
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {serviceCardLinks.map((category) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                      category.available
                        ? "bg-primary"
                        : "bg-slate-100 grayscale"
                    }`}
                    aria-hidden="true"
                  >
                    {category.icon}
                  </span>

                  {category.available ? (
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                      {translated?.available ?? "Available"}
                    </span>
                  ) : (
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                      {translated?.comingSoon ?? "Coming soon"}
                    </span>
                  )}
                </div>

                <div className="mt-8">
                  <h3
                    className={`text-2xl font-bold ${
                      category.available
                        ? "text-primary"
                        : "text-slate-900"
                    }`}
                  >
                    {category.name}
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                    {category.description}
                  </p>
                </div>
              </>
            );

            const className = `group relative min-h-52 rounded-2xl border p-5 transition-all ${
              category.available
                ? "border-primary bg-[#f7faf9] shadow-[0_18px_45px_rgba(1,73,62,0.12)]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`;

            if (!category.available) {
              return (
                <article key={category.slug} className={className}>
                  {content}
                </article>
              );
            }

            return (
              <Link
                key={category.slug}
                href={`/${locale}/services/${category.slug}`}
                className={className}
              >
                {content}
              </Link>
            );
          })}
        </div>

        <div className="mt-9 text-center">
          <a
            href="#"
            className="inline-flex items-center text-base font-bold text-primary transition-opacity hover:opacity-75"
          >
            {translated?.viewAll ?? "View all categories"} {"->"}
          </a>
        </div>
      </div>
    </section>
  );
}
