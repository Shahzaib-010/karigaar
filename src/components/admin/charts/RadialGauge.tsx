"use client";

import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

import { cn } from "@/lib/utils";
import { PRIMARY } from "./palette";
import "./chartSetup";

// 270° gauge built on a Chart.js doughnut (rotation + circumference). Smooth
// arc sweep and no manual SVG maths.
export default function RadialGauge({
  value,
  size = 180,
  color = PRIMARY,
  label,
  sublabel,
  className,
}: {
  value: number;
  size?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(1, value));
  const pct = Math.round(clamped * 100);

  const chartData = useMemo(
    () => ({
      labels: ["Completed", "Remaining"],
      datasets: [
        {
          data: [pct, 100 - pct],
          backgroundColor: [color, "#EDEDE9"],
          borderWidth: 0,
          borderRadius: [{ outerStart: 10, outerEnd: 10, innerStart: 10, innerEnd: 10 }, 0],
        },
      ],
    }),
    [pct, color]
  );

  const options: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "76%",
      rotation: -135,
      circumference: 270,
      animation: { duration: 1100, easing: "easeOutQuart" },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    }),
    []
  );

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <Doughnut data={chartData} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[2.15rem] font-semibold leading-none tracking-tight tabular-nums">
          {pct}
          <span className="text-lg font-medium text-muted-foreground">%</span>
        </span>
        {label ? <span className="mt-1.5 text-sm font-medium">{label}</span> : null}
        {sublabel ? (
          <span className="mt-0.5 text-xs text-muted-foreground">{sublabel}</span>
        ) : null}
      </div>
    </div>
  );
}
