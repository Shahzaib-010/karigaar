"use client";

import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Search",
    body: "Type what you need or tap a category. See nearby verified workers with ratings and reviews — all in one place.",
    className: "bg-[var(--primary)] text-white",
    mutedClassName: "text-white/78",
    arrowClassName: "text-white",
  },
  {
    title: "Book",
    body: "Choose your worker, pick a time, and share your address. Your booking is confirmed in under a minute.",
    className: "bg-[#dff8ed] text-[var(--primary)]",
    mutedClassName: "text-[#315f55]",
    arrowClassName: "text-[var(--primary)]",
  },
  {
    title: "Done",
    body: "Your worker arrives, gets the job done right. Rate them after — and your next booking gets even easier.",
    className: "bg-[#06241f] text-white",
    mutedClassName: "text-white/72",
    arrowClassName: "text-white",
  },
];

export default function HowItWorks() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        eyebrow: "طریقہ کار",
        title: "3 آسان مراحل",
        steps: [
          { title: "تلاش کریں", body: "اپنی ضرورت لکھیں یا کسی زمرے پر ٹیپ کریں۔ قریب موجود تصدیق شدہ کاریگر، ریٹنگ اور ریویوز کے ساتھ ایک ہی جگہ دیکھیں۔" },
          { title: "بک کریں", body: "اپنے کاریگر کو چنیں، وقت منتخب کریں اور اپنا پتہ شیئر کریں۔ آپ کی بکنگ ایک منٹ سے بھی کم میں کنفرم ہو جاتی ہے۔" },
          { title: "مکمل", body: "کاریگر آتا ہے، کام ٹھیک طریقے سے کرتا ہے۔ بعد میں ریٹنگ دیں تاکہ اگلی بکنگ اور بھی آسان ہو جائے۔" },
        ],
      }
    : null;

  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 text-center sm:mb-10 md:text-left lg:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
            {copy?.eyebrow ?? "How It Works"}
          </p>
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy?.title ?? "3 Simple Steps"}
          </h2>
        </div>

        <div className="mx-auto grid max-w-md gap-5 sm:max-w-xl md:max-w-none md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.6rem] p-6 shadow-sm ring-1 ring-black/5 sm:min-h-[500px] sm:p-8 md:min-h-[460px] md:p-5 lg:min-h-[520px] lg:rounded-[1.75rem] lg:p-8 ${step.className}`}
            >
              <h3 className="max-w-xs text-5xl font-bold leading-[0.92] md:text-4xl lg:text-6xl">
                {copy?.steps[index].title ?? step.title}
              </h3>

              <p
                className={`mt-6 max-w-md text-base font-bold leading-7 md:text-sm md:leading-6 lg:mt-7 lg:text-lg lg:leading-8 ${step.mutedClassName}`}
              >
                {copy?.steps[index].body ?? step.body}
              </p>

              <ArrowRight
                className={`absolute bottom-5 right-6 size-10 sm:size-12 md:bottom-5 md:right-5 lg:bottom-6 lg:right-7 lg:size-14 ${step.arrowClassName}`}
                strokeWidth={1.75}
                aria-hidden
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
