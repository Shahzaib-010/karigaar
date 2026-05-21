"use client";

import { useLocale } from "next-intl";

const reviews = [
  {
    rating: "★★★★★",
    quote:
      "Excellent work done. He arrived on time, cleaned up after himself, and the price was very reasonable. Will definitely call again.",
    author: "Kamran Ahmed, Lahore",
    booking: "Plumber booking",
  },
  {
    rating: "★★★★★",
    quote:
      "First time using Karigaar and honestly I was skeptical. But the electrician fixed everything in 20 minutes flat. No more stress with home repairs.",
    author: "Saba Malik, Karachi",
    booking: "Electrician booking",
  },
  {
    rating: "★★★★☆",
    quote:
      "AC service was great. Booking on the app was so simple. Everything was clearly explained and the worker was professional throughout.",
    author: "Tariq Hussain, Faisalabad",
    booking: "AC Repair booking",
  },
];

export default function Testimonials() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  const copy = isUrdu
    ? {
        title: "لوگ کیا کہہ رہے ہیں",
        subtitle: "حقیقی صارفین، حقیقی ریویوز - بغیر اسکرپٹ اور ایماندار",
      }
    : null;

  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            {copy?.title ?? "What People Are Saying"}
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            {copy?.subtitle ?? "Real customers, real reviews - unscripted and honest"}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={review.author}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
            >
              <p className="text-lg font-bold tracking-[0.12em] text-primary">
                {review.rating}
              </p>
              <blockquote className="mt-5 text-base font-semibold leading-7 text-slate-700">
                &ldquo;{review.quote}&rdquo;
              </blockquote>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-sm font-bold text-slate-950">
                  {review.author}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {review.booking}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5">
          <span className="h-2.5 w-8 rounded-full bg-primary" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
      </div>
    </section>
  );
}
