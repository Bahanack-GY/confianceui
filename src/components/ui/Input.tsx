import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, leftIcon, rightIcon, invalid, ...rest },
  ref,
) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 h-11 px-3 rounded-[10px] bg-white border border-[color:var(--color-border)] transition-base",
        "focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20",
        invalid && "border-danger-500 focus-within:ring-danger-500/20 focus-within:border-danger-500",
        className,
      )}
    >
      {leftIcon && <span className="text-[color:var(--color-muted)] shrink-0">{leftIcon}</span>}
      <input
        ref={ref}
        className="flex-1 bg-transparent outline-none placeholder:text-[color:var(--color-muted-soft)] text-sm"
        {...rest}
      />
      {rightIcon && <span className="text-[color:var(--color-muted)] shrink-0">{rightIcon}</span>}
    </div>
  );
});
