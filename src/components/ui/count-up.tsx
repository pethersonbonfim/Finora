"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  format,
  duration = 850,
}: {
  value: number;
  format: (value: number) => string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(value);
      previous.current = value;
      return;
    }

    const from = previous.current;
    const to = value;
    if (from === to) {
      setDisplay(to);
      return;
    }

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      } else {
        previous.current = to;
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      previous.current = to;
    };
  }, [value, duration]);

  return <span>{format(display)}</span>;
}
