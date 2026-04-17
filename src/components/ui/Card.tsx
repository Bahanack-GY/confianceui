import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export function Card({ className, padded = true, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[color:var(--color-border-soft)] rounded-[14px]",
        padded && "p-5",
        className,
      )}
      {...rest}
    />
  );
}

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-4", className)}>
      <div>
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {subtitle && <p className="text-[13px] text-[color:var(--color-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
