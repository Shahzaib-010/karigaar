"use client";

import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Pick a service",
    body: "Choose the service you need, pick a time that suits you, and share your address. Booking takes under a minute.",
    className: "bg-[var(--primary)] text-white",
    mutedClassName: "text-white/78",
    arrowClassName: "text-white",
  },
  {
    title: "We assign a pro",
    body: "We review your booking and assign a trained, verified professional from our team for the job.",
    className: "bg-[#dff8ed] text-[var(--primary)]",
    mutedClassName: "text-[#315f55]",
    arrowClassName: "text-[var(--primary)]",
  },
  {
    title: "Job done",
    body: "Your professional arrives and gets it done right. Rate the service once it's complete.",
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
          { title: "خدمت منتخب کریں", body: "جو خدمت درکار ہو منتخب کریں، اپنی پسند کا وقت چنیں اور اپنا پتہ شیئر کریں۔ بکنگ میں ایک منٹ سے بھی کم لگتا ہے۔" },
          { title: "ہم ماہر مقرر کرتے ہیں", body: "ہم آپ کی بکنگ کا جائزہ لے کر اپنی ٹیم سے ایک تربیت یافتہ، تصدیق شدہ ماہر مقرر کرتے ہیں۔" },
          { title: "کام مکمل", body: "ماہر آتا ہے اور کام درست طریقے سے مکمل کرتا ہے۔ مکمل ہونے پر خدمت کو ریٹنگ دیں۔" },
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
