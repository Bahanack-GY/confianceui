import { useEffect, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" } as const;

export function Modal({ open, onClose, title, description, footer, children, size = "md" }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-[#0b1020]/40" />
      <div
        className={cn(
          "relative w-full bg-white rounded-[14px] border border-[color:var(--color-border-soft)] shadow-[0_20px_60px_-20px_rgba(9,28,83,0.25)] flex flex-col max-h-[90vh]",
          sizes[size],
        )}
      >
        {(title || description) && (
          <div className="px-6 pt-5 pb-4 border-b border-[color:var(--color-border-soft)]">
            {title && <h3 className="text-[16px] font-semibold text-ink">{title}</h3>}
            {description && <p className="text-[13px] text-[color:var(--color-muted)] mt-0.5">{description}</p>}
          </div>
        )}
        <div className="px-6 py-5 overflow-y-auto">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-[color:var(--color-border-soft)] flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
