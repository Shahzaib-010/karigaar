"use client";

const categories = [
  { icon: "🔧", label: "Plumber" },
  { icon: "⚡", label: "Electrician" },
  { icon: "🪚", label: "Carpenter" },
  { icon: "🎨", label: "Painter" },
  { icon: "❄️", label: "AC Repair" },
  { icon: "🏠", label: "Mason" },
];

const trustItems = [
  "2,400+ verified workers",
  "18 cities",
  "Rated by real customers",
];

export default function Home() {
  return (
    <div className="flex flex-1 bg-[#f7faf9] font-sans text-slate-950">
      <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <section className="mx-auto w-full text-center">
          <p className="mb-5 inline-flex rounded-full border border-[color-mix(in_srgb,var(--primary)_18%,white)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary)] shadow-sm">
            Pakistan&apos;s #1 Skilled Worker Platform
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
            Your Karigaar,
            <span className="block text-[var(--primary)]">At Your Door</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-600 sm:text-xl">
            Whatever needs fixing at home, we send trained, verified workers
            straight to your doorstep. Fast, safe, and affordable.
          </p>

          <form className="mt-9 rounded-2xl border border-slate-200 bg-white p-2 text-left shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
            <div className="grid gap-2 lg:grid-cols-[1fr_auto_auto]">
              <label className="flex min-h-14 items-center gap-3 rounded-xl bg-slate-50 px-4">
                <span
                  className="text-lg font-bold text-slate-400"
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  placeholder="What work do you need? e.g. plumber, electrician..."
                  className="w-full bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <button
                type="button"
                className="min-h-14 rounded-xl border border-slate-200 bg-white px-5 text-left text-sm font-bold text-slate-700 transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                📍 Select your city
              </button>

              <button
                type="submit"
                className="min-h-14 rounded-xl bg-[var(--primary)] px-8 text-base font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            {categories.map((category) => (
              <button
                key={category.label}
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                <span className="mr-2" aria-hidden="true">
                  {category.icon}
                </span>
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold text-slate-500">
            {trustItems.map((item) => (
              <span key={item} className="flex items-center gap-2">
                <span className="text-[var(--primary)]">✓</span>
                {item}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
