"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

import { cn } from "@/lib/utils";
import { PRIMARY } from "./palette";
import "./chartSetup";

// Horizontal bar chart for ranked magnitude (Top categories). Rounded bars,
// recessive grid, formatted tooltips.
export default function HBarChart({
  labels,
  values,
  color = PRIMARY,
  height = 220,
  formatValue,
  className,
}: {
  labels: string[];
  values: number[];
  color?: string;
  height?: number;
  formatValue?: (n: number) => string;
  className?: string;
}) {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: color,
          hoverBackgroundColor: color,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: "flex" as const,
          maxBarThickness: 28,
          categoryPercentage: 0.7,
        },
      ],
    }),
    [labels, values, color]
  );

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const x = ctx.parsed.x ?? 0;
              return ` ${formatValue ? formatValue(x) : x.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        x: {
          border: { display: false },
          grid: { color: "rgba(16,24,40,0.06)" },
          ticks: {
            callback: (v) =>
              formatValue ? formatValue(Number(v)) : Number(v).toLocaleString(),
            maxTicksLimit: 5,
          },
        },
        y: {
          border: { display: false },
          grid: { display: false },
          ticks: { font: { weight: 500 } },
        },
      },
    }),
    [formatValue]
  );

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
