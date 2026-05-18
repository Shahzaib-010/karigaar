const categories = [
  {
    icon: "🔧",
    name: "Plumber",
    description: "Pipe leaks, taps, bathroom fitting",
    available: false,
  },
  {
    icon: "⚡",
    name: "Electrician",
    description: "Wiring, switches, fans, power issues",
    available: false,
  },
  {
    icon: "🪚",
    name: "Carpenter",
    description: "Doors, wardrobes, furniture repair",
    available: true,
  },
  {
    icon: "🎨",
    name: "Painter",
    description: "Interior painting, wall putty, polish",
    available: false,
  },
  {
    icon: "❄️",
    name: "AC & Refrigerator",
    description: "Servicing, gas refill, installation",
    available: true,
  },
  {
    icon: "🏠",
    name: "Mason",
    description: "Roofing, wall repair, tile work",
    available: false,
  },
  {
    icon: "🔩",
    name: "Welder",
    description: "Grills, gates, iron work",
    available: false,
  },
  {
    icon: "🧹",
    name: "Cleaning",
    description: "Deep clean, sofa, carpet washing",
    available: false,
  },
];

export default function BrowseByTrade() {
  return (
    <section className="bg-white py-16 font-sans text-slate-950 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-karigaar text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Browse by Trade
          </h2>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600 sm:text-lg">
            Every home job covered — find the right expert for the right work
          </p>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <article
              key={category.name}
              className={`group relative min-h-52 rounded-2xl border p-5 transition-all ${
                category.available
                  ? "border-[var(--primary)] bg-[#f7faf9] shadow-[0_18px_45px_rgba(1,73,62,0.12)]"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                    category.available
                      ? "bg-[var(--primary)]"
                      : "bg-slate-100 grayscale"
                  }`}
                  aria-hidden="true"
                >
                  {category.icon}
                </span>

                {category.available ? (
                  <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white">
                    Available
                  </span>
                ) : (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                    Coming soon
                  </span>
                )}
              </div>

              <div className="mt-8">
                <h3
                  className={`text-2xl font-bold ${
                    category.available ? "text-[var(--primary)]" : "text-slate-900"
                  }`}
                >
                  {category.name}
                </h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                  {category.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-9 text-center">
          <a
            href="#"
            className="inline-flex items-center text-base font-bold text-[var(--primary)] transition-opacity hover:opacity-75"
          >
            View all categories →
          </a>
        </div>
      </div>
    </section>
  );
}
