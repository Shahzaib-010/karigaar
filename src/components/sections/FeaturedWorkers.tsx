const workers = [
  {
    name: "Usman Ali",
    trade: "AC Technician",
    city: "Lahore",
    rating: "4.9",
    jobs: 186,
    initials: "UA",
  },
  {
    name: "Bilal Ahmed",
    trade: "Refrigerator Expert",
    city: "Karachi",
    rating: "4.8",
    jobs: 142,
    initials: "BA",
  },
  {
    name: "Naveed Khan",
    trade: "Cooling Specialist",
    city: "Islamabad",
    rating: "4.7",
    jobs: 119,
    initials: "NK",
  },
];

export default function FeaturedWorkers() {
  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
            Top Workers Near You
          </p>
          <h2 className="font-karigaar mt-3 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Verified, Rated, and Ready
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            Every worker below has been rated by real customers — no fake
            reviews, no shortcuts
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {workers.map((worker) => (
            <article
              key={worker.name}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--primary)_12%,white)] text-xl font-bold text-[var(--primary)]">
                    {worker.initials}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-950">
                      {worker.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-slate-500">
                      {worker.trade} · {worker.city}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                  Verified
                </span>
              </div>

              <div className="mt-7 rounded-2xl bg-slate-50 p-4">
                <p className="text-base font-bold text-slate-900">
                  <span className="text-amber-500">★</span> {worker.rating}
                  <span className="ml-2 text-sm font-semibold text-slate-500">
                    ({worker.jobs} jobs done)
                  </span>
                </p>
              </div>

              <button
                type="button"
                className="mt-5 min-h-12 w-full rounded-2xl bg-[var(--primary)] px-5 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                Book Now
              </button>
            </article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <a
            href="#"
            className="inline-flex items-center text-base font-bold text-[var(--primary)] transition-opacity hover:opacity-75"
          >
            See all workers →
          </a>
        </div>
      </div>
    </section>
  );
}
