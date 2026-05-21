"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";
import type { WorkerProfile, WorkerReview, WorkerSummary } from "@/src/data/workers";

type Props = {
  locale: string;
  worker: WorkerProfile;
  similarWorkers: WorkerSummary[];
};

const reviewFilters = ["All", "5 Star", "Most Recent", "With Photos"] as const;

function renderStars(rating: number) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return `${"*".repeat(full)}${".".repeat(empty)}`;
}

function filterReviews(reviews: WorkerReview[], filter: string) {
  if (filter === "5 Star") {
    return reviews.filter((review) => review.rating === 5);
  }

  if (filter === "With Photos") {
    return reviews.filter((review) => review.photo);
  }

  if (filter === "Most Recent") {
    return [...reviews];
  }

  return reviews;
}

export default function WorkerProfilePage({
  locale,
  worker,
  similarWorkers,
}: Props) {
  const currentLocale = useLocale();
  const isUrdu = locale === "ur" || currentLocale === "ur";
  const [selectedDay, setSelectedDay] = useState(
    worker.availability.find((day) => day.status === "available")?.day ??
      worker.availability[0]?.day,
  );
  const [selectedFilter, setSelectedFilter] =
    useState<(typeof reviewFilters)[number]>("All");
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  const visibleReviews = filterReviews(worker.reviews, selectedFilter);

  const copy = isUrdu
    ? {
        pin: "مقام",
        joined: "شامل ہوئے",
        jobsCompleted: "کام مکمل کیے",
        share: "شیئر کریں",
        save: "محفوظ کریں",
        call: "ابھی کال کریں",
        book: "ابھی بک کریں",
        rating: "ریٹنگ",
        experience: "تجربہ",
        averageResponse: "اوسط جواب",
        about: "کے بارے میں",
        services: "دی جانے والی خدمات",
        service: "سروس",
        price: "ابتدائی قیمت",
        duration: "مدت",
        finalPrice: "حتمی قیمت کام کی پیچیدگی کے مطابق بدل سکتی ہے۔ کام شروع ہونے سے پہلے بات اور اتفاق کیا جاتا ہے۔",
        availability: "اس ہفتے دستیابی",
        pastWork: "پچھلا کام",
        customerReviews: "صارفین کے ریویوز",
        overall: "مجموعی ریٹنگ",
        reviews: "ریویوز",
        loadMore: "مزید ریویوز لوڈ کریں",
        serviceArea: "سروس ایریا",
        coverage: "کوریج رینج",
        travel: "سفر کے چارجز بنیادی علاقے سے باہر لاگو ہو سکتے ہیں۔ بکنگ کے وقت تصدیق کریں۔",
        other: "دیگر کاریگر",
        nearby: "آپ کے قریب",
        unavailable: "اگر یہ کاریگر دستیاب نہ ہو",
        bookNow: "ابھی بک کریں",
        close: "بند کریں",
        filters: ["تمام", "5 اسٹار", "تازہ ترین", "فوٹو کے ساتھ"],
        status: { available: "دستیاب", full: "مکمل", off: "چھٹی" },
      }
    : null;

  return (
    <>
      <main className="bg-[#f7faf9] font-sans text-slate-950">
        <section className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-6 sm:pb-32 lg:px-8 lg:pb-16 lg:pt-10">
          <div className="flex items-start justify-between gap-4">
            <div className="grid gap-6 lg:grid-cols-[120px_1fr] lg:items-center">
              <div className="relative h-[120px] w-[120px]">
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="h-full w-full rounded-full object-cover ring-4 ring-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
                />
                <span className="absolute bottom-1 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white ring-4 ring-white">
                  OK
                </span>
                <span
                  className={`absolute left-2 top-2 h-4 w-4 rounded-full ring-4 ring-white ${
                    worker.status === "online" ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <h1 className="font-karigaar text-4xl font-bold leading-tight sm:text-5xl">
                  {worker.name}
                </h1>
                <p className="mt-2 text-base font-bold text-[var(--primary)] sm:text-lg">
                  {worker.trade}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-slate-500">
                  <span>{copy?.pin ?? "Pin"} {worker.location}</span>
                  <span>{copy?.joined ?? "Joined"} {worker.joined}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-slate-600 sm:text-base">
                  <span className="text-lg font-bold text-amber-500">
                    * {worker.rating}
                  </span>
                  <span>{worker.jobs} {copy?.jobsCompleted ?? "jobs completed"}</span>
                  <span>{worker.responseTime}</span>
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                {copy?.share ?? "Share"}
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
                {copy?.save ?? "Save"}
              </button>
            </div>
          </div>

          <div className="sticky top-16 z-30 mt-8 rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur sm:top-20 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="text-sm font-bold text-slate-700 sm:text-base">
                {worker.name} · {worker.trade} · * {worker.rating}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:w-auto">
                <button className="min-h-11 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800">
                  {copy?.call ?? "Call Now"}
                </button>
                <button className="min-h-11 rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold text-white shadow-sm">
                  {copy?.book ?? "Book Now"}
                </button>
              </div>
            </div>
          </div>

          <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: copy?.rating ?? "Rating", value: `${worker.rating} *` },
              { label: copy?.jobsCompleted ?? "Jobs Done", value: `${worker.jobs}` },
              { label: copy?.experience ?? "Experience", value: worker.experience },
              { label: copy?.averageResponse ?? "Avg. Response", value: worker.responseAverage },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm"
              >
                <p className="text-2xl font-bold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.about ?? "About"} {worker.name.split(" ")[0]}
            </h2>
            <p className="mt-4 max-w-4xl text-base font-semibold leading-8 text-slate-600">
              &ldquo;{worker.bio}&rdquo;
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#edf8f4] px-4 py-2 text-sm font-bold text-[var(--primary)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.services ?? "Services Offered"}
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-[#f7faf9]">
                  <tr className="text-sm font-bold text-slate-600">
                    <th className="px-4 py-4 sm:px-5">{copy?.service ?? "Service"}</th>
                    <th className="px-4 py-4 sm:px-5">{copy?.price ?? "Starting Price"}</th>
                    <th className="px-4 py-4 sm:px-5">{copy?.duration ?? "Duration"}</th>
                  </tr>
                </thead>
                <tbody>
                  {worker.services.map((service) => (
                    <tr
                      key={service.service}
                      className="border-t border-slate-100 text-sm font-semibold text-slate-700 sm:text-base"
                    >
                      <td className="px-4 py-4 sm:px-5">{service.service}</td>
                      <td className="px-4 py-4 font-bold text-slate-950 sm:px-5">
                        {service.price}
                      </td>
                      <td className="px-4 py-4 sm:px-5">{service.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {copy?.finalPrice ?? "Final price may vary based on job complexity. Discussed and agreed before work begins."}
            </p>
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.availability ?? "Availability This Week"}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {worker.availability.map((day) => {
                const stateClasses =
                  day.status === "available"
                    ? "bg-emerald-50 text-emerald-700"
                    : day.status === "full"
                      ? "bg-slate-100 text-slate-500"
                      : "bg-rose-50 text-rose-600";

                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => setSelectedDay(day.day)}
                    className={`rounded-2xl px-4 py-4 text-center shadow-sm ring-1 ring-black/5 transition ${
                      selectedDay === day.day
                        ? "ring-2 ring-[var(--primary)]"
                        : "ring-1 ring-black/5"
                    } ${stateClasses}`}
                  >
                    <p className="text-sm font-bold">{day.day}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em]">
                      {isUrdu ? copy?.status?.[day.status] ?? day.status : day.status}
                    </p>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {worker.timeSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full border border-slate-200 bg-[#f7faf9] px-4 py-2 text-sm font-bold text-slate-700"
                >
                  {slot}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.pastWork ?? "Past Work"}
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-600">
              {isUrdu
                ? `${worker.name.split(" ")[0]} کی بھیجی گئی تصاویر اور صارفین کی طرف سے تصدیق شدہ`
                : `Photos submitted by ${worker.name.split(" ")[0]} and verified by customers`}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
              {worker.portfolio.map((photo, index) => (
                <button
                  key={photo.alt}
                  type="button"
                  onClick={() => setActivePhoto(index)}
                  className="group relative overflow-hidden rounded-3xl"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-44 w-full object-cover transition duration-300 group-hover:scale-105 sm:h-52"
                  />
                  {index === worker.portfolio.length - 1 ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-950/45 text-lg font-bold text-white">
                      + {isUrdu ? "تمام تصاویر دیکھیں (12 تصاویر)" : "View all (12 photos)"}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.customerReviews ?? "Customer Reviews"}
            </h2>
            <div className="mt-6 grid gap-8 lg:grid-cols-[320px_1fr]">
              <div className="rounded-3xl bg-[#f7faf9] p-5">
                <p className="text-3xl font-bold text-slate-950">
                  {copy?.overall ?? "Overall"}: {worker.reviewSummary.overall} *
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  ({worker.reviewSummary.total} {copy?.reviews ?? "reviews"})
                </p>
                <div className="mt-6 space-y-3">
                  {worker.reviewSummary.breakdown.map((item) => (
                    <div key={item.label} className="grid grid-cols-[58px_1fr_42px] items-center gap-3">
                      <span className="text-sm font-bold text-slate-700">
                        {item.label.replace("Star", "*")}
                      </span>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-[var(--primary)]"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-500">
                        {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex flex-wrap gap-2.5">
                  {reviewFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setSelectedFilter(filter)}
                      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                        selectedFilter === filter
                          ? "bg-[var(--primary)] text-white"
                          : "border border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  {visibleReviews.map((review) => (
                    <article
                      key={review.id}
                      className="rounded-3xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf8f4] text-sm font-bold text-[var(--primary)]">
                            {review.name.slice(0, 1)}
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-950">
                              {review.name} · {review.city} · {renderStars(review.rating)}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              {review.date} · {review.jobType}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="mt-4 text-base font-semibold leading-7 text-slate-700">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      {review.photo ? (
                        <img
                          src={review.photo}
                          alt={review.jobType}
                          className="mt-4 h-40 w-full rounded-2xl object-cover sm:max-w-xs"
                        />
                      ) : null}
                    </article>
                  ))}
                </div>

                <button className="mt-6 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700">
                {copy?.loadMore ?? "Load more reviews"}
                </button>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
              {copy?.serviceArea ?? "Service Area"}
            </h2>
            <p className="mt-3 text-base font-semibold text-slate-600">
              {isUrdu
                ? `${worker.name.split(" ")[0]} ${worker.mapCenter} میں ان علاقوں کو کور کرتا ہے`
                : `${worker.name.split(" ")[0]} covers these areas in ${worker.mapCenter}`}
            </p>
            <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-[#eaf4f1]">
              <div className="flex h-[280px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(1,73,62,0.14),transparent_38%),linear-gradient(135deg,#eaf4f1,#d6ece6)] text-center">
                <div>
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {copy?.coverage ?? "Coverage radius"}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    {isUrdu ? `${worker.mapCenter} سروس میپ پلیس ہولڈر` : `${worker.mapCenter} service map placeholder`}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {worker.serviceAreas.map((area) => (
                <span
                  key={area}
                  className="rounded-full bg-[#f7faf9] px-4 py-2 text-sm font-bold text-slate-700"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">
              {copy?.travel ?? "Travel charges may apply outside primary area. Confirm at time of booking."}
            </p>
          </section>

          <section className="mt-10">
            <div className="max-w-3xl">
              <h2 className="font-karigaar text-3xl font-bold sm:text-4xl">
                {copy?.other ?? "Other"} {worker.trade}s {copy?.nearby ?? "Near You"}
              </h2>
              <p className="mt-3 text-base font-semibold text-slate-600">
                {isUrdu
                  ? `${worker.name.split(" ")[0]} دستیاب نہ ہو تو`
                  : `In case ${worker.name.split(" ")[0]} is unavailable`}
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {similarWorkers.map((similar) => (
                <article
                  key={similar.slug}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <img
                    src={similar.photo}
                    alt={similar.name}
                    className="h-52 w-full rounded-2xl object-cover"
                  />
                  <div className="mt-5">
                    <h3 className="text-xl font-bold text-slate-950">
                      {similar.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {similar.trade}
                    </p>
                    <p className="mt-3 text-sm font-bold text-slate-700">
                      * {similar.rating} · {similar.jobs} {copy?.jobsCompleted ?? "jobs done"}
                    </p>
                  </div>
                  <Link
                    href={`/${locale}/workers/${similar.slug}`}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-5 text-sm font-bold text-white"
                  >
                    {copy?.bookNow ?? "Book Now"}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/96 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">
              * {worker.rating} · {worker.jobs} jobs · {worker.startingPrice} starting
            </p>
          </div>
          <button className="min-h-11 rounded-2xl bg-[var(--primary)] px-6 text-sm font-bold text-white shadow-sm">
            {copy?.bookNow ?? "Book Now"}
          </button>
        </div>
      </div>

      {activePhoto !== null ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/92 px-4 py-6">
          <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
              >
                {copy?.close ?? "Close"}
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <img
                src={worker.portfolio[activePhoto].src}
                alt={worker.portfolio[activePhoto].alt}
                className="max-h-full w-full rounded-3xl object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
