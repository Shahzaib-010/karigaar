"use client";

// Central Chart.js registration — imported once by every chart component so the
// tree-shakeable pieces are registered a single time. Also sets the global font
// and label colour so charts match the admin UI without per-chart config.
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

ChartJS.defaults.font.family =
  "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#6B6B6B";
ChartJS.defaults.plugins.tooltip.backgroundColor = "#1A1A1A";
ChartJS.defaults.plugins.tooltip.padding = 10;
ChartJS.defaults.plugins.tooltip.cornerRadius = 8;
ChartJS.defaults.plugins.tooltip.boxPadding = 4;
ChartJS.defaults.plugins.tooltip.titleFont = { weight: "bold", size: 12 };

export { ChartJS };
