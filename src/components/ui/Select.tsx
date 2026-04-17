import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, invalid, children, ...rest }, ref,
) {
  return (
    <div
      className={cn(
        "flex items-center h-11 rounded-[10px] bg-white border border-[color:var(--color-border)] transition-base",
        "focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
        invalid && "border-danger-500",
        className,
      )}
    >
      <select
        ref={ref}
        className="w-full bg-transparent outline-none text-sm px-3 appearance-none"
        {...rest}
      >
        {children}
      </select>
      <svg className="mr-3 text-[color:var(--color-muted)] shrink-0" width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
});
