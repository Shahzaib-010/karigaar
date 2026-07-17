"use client";

import { useEffect, useState } from "react";
import { animate } from "motion/react";

// Animated number for KPI hero figures. Counts from 0 to `value` on mount and
// whenever `value` changes; `format` controls the rendered string.
export default function CountUp({
  value,
  format,
}: {
  value: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);

  return <>{format ? format(display) : Math.round(display).toLocaleString()}</>;
}
