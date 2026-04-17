import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Tab { id: string; label: ReactNode; icon?: ReactNode; }

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: Props) {
  return (
    <div className={cn("flex items-center gap-1 border-b border-[color:var(--color-border-soft)]", className)}>
      {tabs.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "inline-flex items-center gap-2 h-10 px-3 text-[13.5px] font-medium transition-base border-b-2 -mb-[1px]",
              isActive
                ? "text-brand-500 border-brand-500"
                : "text-[color:var(--color-muted)] border-transparent hover:text-ink",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
