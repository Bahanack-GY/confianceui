import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: Props) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div className="min-w-0">
        <h1 className="text-[22px] font-semibold text-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-[13.5px] text-[color:var(--color-muted)] mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
