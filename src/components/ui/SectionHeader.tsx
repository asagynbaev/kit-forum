import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "between";
  rightSlot?: ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  rightSlot,
  className,
}: Props) {
  return (
    <div
      className={`grid gap-8 lg:gap-14 ${
        align === "between"
          ? "lg:grid-cols-[1fr_auto] lg:items-end"
          : "lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)]"
      } ${className ?? ""}`}
    >
      <div>
        {eyebrow && (
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-8 bg-ink-soft/40" aria-hidden />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h2 className="h-section mt-5 text-balance">{title}</h2>
        </Reveal>
      </div>
      {(description || rightSlot) && (
        <div className="flex flex-col gap-6 lg:items-end lg:text-right">
          {description && (
            <Reveal delay={0.1}>
              <div className="lead text-balance lg:max-w-[520px] lg:text-left">
                {description}
              </div>
            </Reveal>
          )}
          {rightSlot && <Reveal delay={0.15}>{rightSlot}</Reveal>}
        </div>
      )}
    </div>
  );
}
