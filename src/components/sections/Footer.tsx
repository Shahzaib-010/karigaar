const footerColumns = [
  {
    title: "Features",
    links: ["Payment", "Card", "Pricing"],
  },
  {
    title: "Support",
    links: ["Help", "FAQ", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Services", "Cookies"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-white py-12 font-sans text-slate-950 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] bg-[var(--primary)] px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-xl">
              <h2 className="font-karigaar text-4xl font-bold leading-[0.98] sm:text-5xl">
                Subscribe our
                <span className="block">newsletter</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-white/72 sm:text-base">
                Subscribe to our newsletter and be the first to receive
                insights, updates, and expert tips on optimizing your home
                services experience.
              </p>
            </div>

            <div className="max-w-xl lg:ml-auto lg:w-full">
              <p className="text-sm font-bold text-white/75">Stay up to date</p>
              <form className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Email address</span>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="min-h-12 w-full rounded-full border border-white/10 bg-[color-mix(in_srgb,var(--primary)_70%,white)] px-5 text-sm font-semibold text-white outline-none placeholder:text-white/55"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d9f279] px-6 text-sm font-bold text-[var(--primary)] transition-opacity hover:opacity-90"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-xs font-semibold leading-5 text-white/55">
                By subscribing you agree to our Privacy Policy.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 text-[2rem] font-bold leading-none text-[var(--primary)]">
              <span className="text-[1.75rem]">↗</span>
              <span>karigaar</span>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              Make every repair, service, and booking feel simpler, safer, and
              more reliable.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold text-slate-950">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm font-semibold text-slate-500 transition-colors hover:text-[var(--primary)]"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </footer>
  );
}
