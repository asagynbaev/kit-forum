import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  suffix?: string;
}

/**
 * Lightweight count-up: starts when the element scrolls into view.
 * Uses IntersectionObserver — no continuous scroll listener.
 */
export function CountUp({
  value,
  duration = 1800,
  format = (n) => n.toLocaleString("ru-RU"),
  suffix,
}: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    let start = 0;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            frame = requestAnimationFrame(animate);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value, duration, prefersReduced]);

  return (
    <span ref={ref} className="tabular tnums">
      {format(display)}
      {suffix}
    </span>
  );
}
