import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  tone?: "dark" | "light";
  pulse?: boolean;
}

export function LiveBadge({ children, tone = "light", pulse = true }: Props) {
  const isDark = tone === "dark";
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase ${
        isDark ? "text-white/85" : "text-ink"
      }`}
    >
      <span
        aria-hidden
        className={`relative h-1.5 w-1.5 rounded-full text-brand-glow ${
          pulse ? "live-pulse" : ""
        }`}
        style={{ backgroundColor: "currentColor", color: "#00D4FF" }}
      />
      {children}
    </span>
  );
}
