"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useState } from "react";
import type { ServiceProfile } from "@/src/data/services";

type Props = {
  locale: string;
  service: ServiceProfile;
};

const workerSorts = [
  "Top Rated",
  "Nearest",
  "Most Jobs",
  "Price: Low to High",
] as const;

function complexityTone(level: string) {
  if (level === "Simple") {
    return "text-emerald-700 bg-emerald-50";
  }

  if (level === "Medium") {
    return "text-amber-700 bg-amber-50";
  }

  return "text-rose-700 bg-rose-50";
}

export default function ServiceDetailPage({ locale, service }: Props) {
  const [sortBy, setSortBy] = useState<(typeof workerSorts)[number]>("Top Rated");

  return (
    <main className="bg-[#f7faf9] font-sans text-slate-950">
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="text-sm font-semibold text-slate-500">
          <Link href={`/${locale}`} className="hover:text-[var(--primary)]">
            Home
          </Link>
          <span className="px-2">{">"}</span>
          <span>Services</span>
          <span className="px-2">{">"}</span>
          <span className="text-slate-700">{service.name}</span>
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
          {service.pageLabel}
        </p>

        <section className="mt-4 rounded-[2rem] bg-[#f0faf6] px-6 py-7 shadow-sm ring-1 ring-[color-mix(in_srgb,var(--primary)_10%,white)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-[color-mix(in_srgb,var(--primary)_12%,white)] text-3xl">
                  {service.icon}
                </div>
                <div className="min-w-0">
                  <h1 className="font-karigaar text-4xl font-bold leading-tight sm:text-5xl">
                    {service.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                {service.heroChips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#d7ede5] bg-white px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#d7ede5] bg-white p-6 shadow-sm sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                Starting from
              </p>
              <p className="mt-2 text-4xl font-bold text-[var(--primary)] sm:text-5xl">
                {service.startingPrice}
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-500">
                Final price depends on job type
              </p>
              <div className="mt-6 grid gap-3">
                <button className="min-h-12 rounded-2xl bg-[var(--primary)] px-6 text-base font-bold text-white shadow-sm">
                  Book a {service.name}
                </button>
                <a
                  href="#pricing"
                  className="text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-75"
                >
                  How pricing works ->
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              What Does a {service.name} Fix?
            </h2>
            <p className="mt-3 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Here is everything our {service.name.toLowerCase()}s are trained
              and equipped to handle
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {service.includes.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf8f4] text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 sm:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="#"
              className="text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-75 sm:text-base"
            >
              Don&apos;t see your issue? Post a custom job ->
            </a>
          </div>
        </section>

        <section className="mt-12 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
            How Booking a {service.name} Works
          </h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            {service.bookingSteps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-3xl bg-[#f7faf9] p-5 ring-1 ring-black/5"
              >
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--primary)]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-xl font-bold text-slate-950">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="pricing"
          className="mt-12 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
            How Much Does It Cost?
          </h2>
          <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            All prices are starting rates. Final price is agreed with the worker
            before any work begins - no surprises.
          </p>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="w-full text-left">
              <thead className="bg-[#f7faf9] text-sm font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-4 sm:px-5">Job Type</th>
                  <th className="px-4 py-4 sm:px-5">Starting Price</th>
                  <th className="px-4 py-4 sm:px-5">Typical Duration</th>
                  <th className="px-4 py-4 sm:px-5">Complexity</th>
                </tr>
              </thead>
              <tbody>
                {service.pricing.map((row) => (
                  <tr
                    key={row.jobType}
                    className="border-t border-slate-100 text-sm font-semibold text-slate-700 sm:text-base"
                  >
                    <td className="px-4 py-4 sm:px-5">{row.jobType}</td>
                    <td className="px-4 py-4 font-bold text-slate-950 sm:px-5">
                      {row.price}
                    </td>
                    <td className="px-4 py-4 sm:px-5">{row.duration}</td>
                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${complexityTone(
                          row.complexity,
                        )}`}
                      >
                        {row.complexity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold sm:text-sm">
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
              Simple - straightforward fix, one worker
            </span>
            <span className="rounded-full bg-amber-50 px-3 py-2 text-amber-700">
              Medium - may need parts, discuss before starting
            </span>
            <span className="rounded-full bg-rose-50 px-3 py-2 text-rose-700">
              Complex - quote given after site inspection
            </span>
          </div>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm font-bold text-amber-900">{service.note}</p>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
                {service.name}s Available Near You
              </h2>
              <p className="mt-3 text-base font-semibold text-slate-600 sm:text-lg">
                Showing results for {service.city} -{" "}
                <a href="#" className="text-[var(--primary)]">
                  Change city
                </a>
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <span className="self-center text-sm font-bold text-slate-500">
                Sort by:
              </span>
              {workerSorts.map((sort) => (
                <button
                  key={sort}
                  type="button"
                  onClick={() => setSortBy(sort)}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    sortBy === sort
                      ? "bg-[var(--primary)] text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {service.workers.map((worker) => (
              <article
                key={worker.slug}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="h-56 w-full rounded-2xl object-cover"
                />
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {worker.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {worker.city}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                    Verified
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-sm font-semibold text-slate-600">
                  <p>
                    * {worker.rating} · {worker.jobs} jobs done
                  </p>
                  <p>Experience linked to verified field history</p>
                  <p>Starting from {service.startingPrice}</p>
                  <p>Responds in ~10 min</p>
                </div>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <Link
                    href={`/${locale}/workers/${worker.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700"
                  >
                    View Profile
                  </Link>
                  <Link
                    href={`/${locale}/workers/${worker.slug}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-bold text-white"
                  >
                    Book Now
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-6">
            <a
              href="#"
              className="text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-75 sm:text-base"
            >
              See all {service.workerCount} {service.name.toLowerCase()}s in{" "}
              {service.city} ->
            </a>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              Before the {service.name} Arrives
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-600 sm:text-lg">
              A little preparation makes the job faster and cheaper
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {service.prepGuide.map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-base font-semibold leading-7 text-slate-700">
                  <span className="mr-3 font-bold text-[var(--primary)]">OK</span>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
            What Happens During the Visit
          </h2>
          <div className="mt-8 space-y-4">
            {service.visitTimeline.map((step, index) => (
              <div key={step.title} className="grid gap-4 md:grid-cols-[110px_1fr]">
                <div className="rounded-2xl bg-[#edf8f4] px-4 py-3 text-sm font-bold text-[var(--primary)]">
                  0{index + 1}
                </div>
                <div className="rounded-3xl border border-slate-200 bg-[#fdfefe] p-5">
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              Your Protection on Every Booking
            </h2>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {service.guarantees.map((guarantee) => (
              <article
                key={guarantee.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f4] text-sm font-bold text-[var(--primary)]">
                  {guarantee.icon}
                </div>
                <h3 className="mt-5 text-2xl font-bold text-slate-950">
                  {guarantee.title}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
                  {guarantee.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              What Customers Say About Our {service.name}s
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-600 sm:text-lg">
              Overall: {service.reviewsSummary.overall} * based on{" "}
              {service.reviewsSummary.totalJobs}
            </p>
          </div>
          <div className="mt-8 grid gap-4 xl:grid-cols-3">
            {service.reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-base font-bold text-slate-950">
                  {review.name} · {review.city} · {review.rating}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {review.jobType} · {review.date}
                </p>
                <p className="mt-4 text-base font-semibold leading-7 text-slate-700">
                  &ldquo;{review.text}&rdquo;
                </p>
              </article>
            ))}
          </div>
          <div className="mt-6">
            <a
              href="#"
              className="text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-75 sm:text-base"
            >
              View all {service.name.toLowerCase()} reviews ->
            </a>
          </div>
        </section>

        <section className="mt-12">
          <div className="max-w-3xl">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              Other Services Available
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-600 sm:text-lg">
              One platform for all your home needs
            </p>
          </div>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {service.relatedServices.map((related) => (
              <Link
                key={related.slug}
                href={`/${locale}/services/${related.slug}`}
                className="min-w-[220px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f4] text-2xl">
                  {related.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">
                  {related.name}
                </h3>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  Starting from
                </p>
                <p className="mt-1 text-base font-bold text-[var(--primary)]">
                  {related.startingFrom}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] bg-[var(--primary)] px-6 py-8 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:px-8 sm:py-10 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-karigaar text-4xl font-bold sm:text-5xl">
              {service.finalCtaTitle}
            </h2>
            <p className="mt-4 text-base font-semibold leading-7 text-white/74 sm:text-lg">
              {service.finalCtaBody}
            </p>
            <div className="mt-7 grid gap-3 sm:flex sm:justify-center">
              <button className="min-h-12 rounded-2xl bg-white px-6 text-base font-bold text-[var(--primary)]">
                Book a {service.name} Now
              </button>
              <button className="min-h-12 rounded-2xl border border-white/30 px-6 text-base font-bold text-white">
                Post a Custom Job
              </button>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-bold text-white/70">
              <span>Free to book</span>
              <span>No advance payment</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
