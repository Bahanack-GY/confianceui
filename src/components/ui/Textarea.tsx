import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, invalid, rows = 4, ...rest }, ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full px-3 py-2.5 rounded-[10px] bg-white border border-[color:var(--color-border)] text-sm outline-none resize-y min-h-[88px] transition-base",
        "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 placeholder:text-[color:var(--color-muted-soft)]",
        invalid && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
        className,
      )}
      {...rest}
    />
  );
});
