"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

import { cn } from "@/lib/utils";
import "./chartSetup";

export type DonutDatum = {
  key: string;
  label: string;
  value: number;
  color: string;
};

// Chart.js doughnut with a soft segment gap + rounded arc ends and an HTML
// centre overlay. Hover tooltips and transitions are Chart.js built-ins, so the
// arcs animate smoothly with no cap distortion.
export default function DonutChart({
  data,
  size = 200,
  className,
  centerLabel = "Total",
  legend = true,
}: {
  data: DonutDatum[];
  size?: number;
  className?: string;
  centerLabel?: string;
  legend?: boolean;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const hasData = total > 0;

  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: hasData ? data.map((d) => d.value) : [1],
          backgroundColor: hasData ? data.map((d) => d.color) : ["#E8E8E4"],
          borderWidth: 0,
          spacing: hasData ? 2 : 0,
          borderRadius: 6,
          hoverOffset: 6,
        },
      ],
    }),
    [data, hasData]
  );

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: hasData,
          callbacks: {
            label: (ctx) => {
              const value = ctx.parsed;
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              return ` ${value.toLocaleString()} · ${pct}%`;
            },
          },
        },
      },
    }),
    [hasData, total]
  );

  return (
    <div className={cn("flex flex-col items-center gap-6 sm:flex-row sm:gap-8", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <Doughnut data={chartData} options={options} />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[1.9rem] font-semibold leading-none tracking-tight tabular-nums">
            {total.toLocaleString()}
          </span>
          <span className="mt-1.5 text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      </div>

      {legend ? (
        <ul className="grid w-full gap-1">
          {data.map((seg) => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0;
            return (
              <li key={seg.key} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.color }} />
                <span className="flex-1 truncate text-sm text-foreground/80">{seg.label}</span>
                <span className="text-sm font-medium tabular-nums">{seg.value.toLocaleString()}</span>
                <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{pct}%</span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
