interface Props {
  className?: string;
  variant?: "light" | "dark";
  hideText?: boolean;
}

export function Logo({ className, variant = "dark", hideText }: Props) {
  return (
    <a
      href="#top"
      className={`group inline-flex items-center gap-3 ${className ?? ""}`}
      aria-label="КИТ Форум — на главную"
    >
      <img
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-md transition-transform duration-500 ease-spring group-hover:rotate-[2deg]"
      />
      {!hideText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-display font-medium text-[15px] tracking-[-0.01em] ${
              variant === "light" ? "text-white" : "text-ink"
            }`}
          >
            КИТ Форум
          </span>
          <span
            className={`mt-1 font-mono text-[10px] tracking-[0.2em] uppercase ${
              variant === "light" ? "text-white/70" : "text-ink-soft"
            }`}
          >
            2026 · Бишкек
          </span>
        </div>
      )}
    </a>
  );
}
