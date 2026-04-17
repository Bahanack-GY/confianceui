import { initials } from "../../lib/utils";
import { cn } from "../../lib/utils";

interface Props {
  name: string;
  src?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-[12px]",
  lg: "h-12 w-12 text-[14px]",
};

export function Avatar({ name, src, size = "md", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-brand-50 text-brand-500 font-semibold overflow-hidden shrink-0",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  );
}
