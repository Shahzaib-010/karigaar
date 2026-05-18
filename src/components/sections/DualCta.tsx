export default function DualCta() {
  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <article className="rounded-[1.75rem] bg-[#edf8f4] p-7 ring-1 ring-[color-mix(in_srgb,var(--primary)_14%,white)] sm:p-9 lg:p-10">
          <div className="flex min-h-[280px] flex-col justify-between gap-10">
            <div>
              <h2 className="font-karigaar text-4xl font-bold leading-tight text-[var(--primary)] sm:text-5xl">
                Need Something Fixed?
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[#315f55] sm:text-lg">
                Find your worker right now — fast, safe, and affordable. No
                haggling, no guessing.
              </p>
            </div>

            <a
              href="#"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-6 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)] sm:w-fit"
            >
              Find a Worker
            </a>
          </div>
        </article>

        <article className="rounded-[1.75rem] bg-[var(--primary)] p-7 text-white shadow-[0_24px_70px_rgba(1,73,62,0.18)] sm:p-9 lg:p-10">
          <div className="flex min-h-[280px] flex-col justify-between gap-10">
            <div>
              <h2 className="font-karigaar text-4xl font-bold leading-tight sm:text-5xl">
                Want More Work?
              </h2>
              <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-white/75 sm:text-lg">
                Join Karigaar and get jobs near your home. Grow your income on
                your own schedule.
              </p>
            </div>

            <a
              href="#"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-white px-6 text-base font-bold text-[var(--primary)] shadow-sm transition-opacity hover:opacity-90 sm:w-fit"
            >
              Register as a Worker
            </a>
          </div>
        </article>
      </div>
    </section>
  );
}
