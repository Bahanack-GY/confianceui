import type { ReactNode } from "react";
import { Card } from "./Card";
import { cn } from "../../lib/utils";

interface Props {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  delta?: { value: string; direction: "up" | "down" | "flat"; tone?: "positive" | "negative" | "neutral" };
  footnote?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, delta, footnote, className }: Props) {
  return (
    <Card className={cn("p-5", className)} padded={false}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12.5px] text-[color:var(--color-muted)] uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-[26px] font-semibold text-ink leading-tight">{value}</p>
          {delta && (
            <div className="mt-2 flex items-center gap-1.5 text-[12.5px]">
              <span
                className={cn(
                  "font-medium",
                  delta.tone === "positive" && "text-success-500",
                  delta.tone === "negative" && "text-danger-500",
                  (!delta.tone || delta.tone === "neutral") && "text-[color:var(--color-muted)]",
                )}
              >
                {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : "•"} {delta.value}
              </span>
              {footnote && <span className="text-[color:var(--color-muted-soft)]">· {footnote}</span>}
            </div>
          )}
          {!delta && footnote && <p className="mt-2 text-[12.5px] text-[color:var(--color-muted)]">{footnote}</p>}
        </div>
        {icon && <span className="text-brand-500 shrink-0">{icon}</span>}
      </div>
    </Card>
  );
}
