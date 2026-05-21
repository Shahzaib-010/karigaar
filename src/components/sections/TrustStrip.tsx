import { Clock, MapPin, Star, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const stats: {
  value: string;
  label: string;
  icon: LucideIcon;
  showStar?: boolean;
}[] = [
  { value: "2,400+", label: "Verified Workers", icon: Users },
  { value: "18", label: "Cities Across Pakistan", icon: MapPin },
  { value: "4.7", label: "Average Customer Rating", icon: Star, showStar: true },
  { value: "60 sec", label: "Average Booking Time", icon: Clock },
];

export default function TrustStrip() {
  return (
    <section className="bg-white py-8 font-sans sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.75rem] bg-[var(--primary)] px-5 py-8 text-white sm:px-8 sm:py-10 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className={`text-center lg:px-6 ${
                    index > 0 ? "lg:border-l lg:border-white/15" : ""
                  }`}
                >
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-5 text-white" strokeWidth={2} aria-hidden />
                  </div>
                  <p className="flex items-center justify-center gap-1 text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                    {stat.value}
                    {stat.showStar ? (
                      <Star
                        className="size-7 fill-[#F59E0B] text-[#F59E0B]"
                        strokeWidth={0}
                        aria-hidden
                      />
                    ) : null}
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-6 text-white/72 sm:text-base">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
