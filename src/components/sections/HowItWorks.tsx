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
  return (
    <section className="bg-[#f7faf9] py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 text-center sm:mb-10 md:text-left lg:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] sm:text-sm">
            How It Works
          </p>
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            3 Simple Steps
          </h2>
        </div>

        <div className="mx-auto grid max-w-md gap-5 sm:max-w-xl md:max-w-none md:grid-cols-3">
          {steps.map((step) => (
            <article
              key={step.title}
              className={`relative flex min-h-[420px] flex-col overflow-hidden rounded-[1.6rem] p-6 shadow-sm ring-1 ring-black/5 sm:min-h-[500px] sm:p-8 md:min-h-[460px] md:p-5 lg:min-h-[520px] lg:rounded-[1.75rem] lg:p-8 ${step.className}`}
            >
              <h3 className="max-w-xs text-5xl font-bold leading-[0.92] md:text-4xl lg:text-6xl">
                {step.title}
              </h3>

              <p
                className={`mt-6 max-w-md text-base font-bold leading-7 md:text-sm md:leading-6 lg:mt-7 lg:text-lg lg:leading-8 ${step.mutedClassName}`}
              >
                {step.body}
              </p>

              <span
                className={`absolute bottom-5 right-6 text-5xl font-semibold leading-none sm:text-6xl md:bottom-5 md:right-5 lg:bottom-6 lg:right-7 ${step.arrowClassName}`}
                aria-hidden="true"
              >
                →
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
