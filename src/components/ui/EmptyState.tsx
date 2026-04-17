import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-6", className)}>
      {icon && <div className="text-[color:var(--color-muted-soft)] mb-4">{icon}</div>}
      <h4 className="text-[15px] font-semibold text-ink">{title}</h4>
      {description && <p className="text-[13.5px] text-[color:var(--color-muted)] mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
