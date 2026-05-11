import type { ComponentPropsWithoutRef, ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  icon?: ReactNode;
};

type AnchorProps = BaseProps & ComponentPropsWithoutRef<"a">;
type ButtonElProps = BaseProps & ComponentPropsWithoutRef<"button">;

const sharedRing =
  "active:scale-[0.98] transition-all duration-300 ease-spring";

export function PrimaryButton({
  children,
  icon,
  className,
  ...rest
}: ButtonElProps) {
  return (
    <button
      {...rest}
      className={`group inline-flex items-center gap-3 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-medium text-white shadow-soft hover:bg-brand-deep hover:shadow-lift ${sharedRing} ${className ?? ""}`}
    >
      <span>{children}</span>
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}

export function PrimaryLink({
  children,
  icon,
  className,
  ...rest
}: AnchorProps) {
  return (
    <a
      {...rest}
      className={`group inline-flex items-center gap-3 rounded-xl bg-brand px-6 py-3.5 text-[15px] font-medium text-white shadow-soft hover:bg-brand-deep hover:shadow-lift ${sharedRing} ${className ?? ""}`}
    >
      <span>{children}</span>
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </a>
  );
}

export function GhostButton({
  children,
  icon,
  className,
  ...rest
}: ButtonElProps) {
  return (
    <button
      {...rest}
      className={`group inline-flex items-center gap-3 rounded-xl border border-line bg-white/10 px-6 py-3.5 text-[15px] font-medium text-white backdrop-blur-md hover:border-white/30 hover:bg-white/15 ${sharedRing} ${className ?? ""}`}
    >
      <span>{children}</span>
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-full border border-white/20 transition-transform duration-500 ease-spring group-hover:translate-x-0.5">
          {icon}
        </span>
      )}
    </button>
  );
}

export function GhostLink({
  children,
  icon,
  className,
  ...rest
}: AnchorProps) {
  return (
    <a
      {...rest}
      className={`group inline-flex items-center gap-3 rounded-xl border border-line bg-canvas px-6 py-3.5 text-[15px] font-medium text-ink hover:border-ink/40 hover:bg-surface ${sharedRing} ${className ?? ""}`}
    >
      <span>{children}</span>
      {icon && (
        <span className="grid h-7 w-7 place-items-center rounded-full border border-line transition-transform duration-500 ease-spring group-hover:translate-x-0.5 group-hover:border-ink/40">
          {icon}
        </span>
      )}
    </a>
  );
}
