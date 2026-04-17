import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

interface Props {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: "text-ink-soft",
  brand:   "text-brand-500",
  success: "text-success-500",
  warning: "text-warning-500",
  danger:  "text-danger-500",
  info:    "text-info-500",
};

export function Badge({ tone = "neutral", className, children }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-6 px-2 rounded-full text-[11.5px] font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
