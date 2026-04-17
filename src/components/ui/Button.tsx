import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-base select-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30";

const variants: Record<Variant, string> = {
  primary:   "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-brand-50 text-brand-500 hover:bg-brand-100",
  ghost:     "bg-transparent text-ink hover:bg-[#f1f3f8]",
  danger:    "bg-danger-500 text-white hover:opacity-90",
  outline:   "bg-white text-ink border border-[color:var(--color-border)] hover:bg-[#f6f7fb]",
};

const sizes: Record<Size, string> = {
  sm:   "h-8 px-3 text-[13px]",
  md:   "h-10 px-4 text-sm",
  lg:   "h-12 px-5 text-[15px]",
  icon: "h-10 w-10 p-0",
};

export function Button({
  className, variant = "primary", size = "md",
  leftIcon, rightIcon, loading, fullWidth, children, disabled, ...rest
}: Props) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin"
    />
  );
}
