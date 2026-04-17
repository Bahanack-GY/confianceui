import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, children, className }: Props) {
  return (
    <section className={cn("mb-8", className)}>
      <header className="mb-3">
        <h2 className="text-[14px] font-semibold text-brand-500 uppercase tracking-wide">{title}</h2>
        {description && <p className="text-[13px] text-[color:var(--color-muted)] mt-0.5">{description}</p>}
      </header>
      {children}
    </section>
  );
}
