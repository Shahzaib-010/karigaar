const stats = [
  { value: "2,400+", label: "Verified Workers" },
  { value: "18", label: "Cities Across Pakistan" },
  { value: "4.7 ★", label: "Average Customer Rating" },
  { value: "60 sec", label: "Average Booking Time" },
];

export default function TrustStrip() {
  return (
    <section className="bg-white py-8 font-sans sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] bg-[var(--primary)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center lg:px-6 ${
                  index > 0 ? "lg:border-l lg:border-white/15" : ""
                }`}
              >
                <p className="text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/72 sm:text-base">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
