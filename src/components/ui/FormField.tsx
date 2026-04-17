import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function FormField({ label, hint, error, required, optional, className, children }: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-[13px] font-medium text-ink-soft flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-danger-500">*</span>}
          {optional && <span className="text-[color:var(--color-muted-soft)] font-normal text-[12px]">(optionnel)</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-[12px] text-danger-500">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-[color:var(--color-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}
