import logoImg from "../../assets/Logo.png";
import { cn } from "../../lib/utils";

interface Props {
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
}

const heights: Record<"sm" | "md" | "lg", number> = { sm: 30, md: 38, lg: 72 };

export function Logo({ size = "md", onDark, className }: Props) {
  const h = heights[size];

  if (onDark) {
    return (
      <div className={cn("flex items-center", className)}>
        <div className="bg-white rounded-[8px] px-2.5 py-1 inline-flex items-center">
          <img
            src={logoImg}
            alt="Confiance Mobilité"
            style={{ height: h }}
            className="object-contain block"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <img
        src={logoImg}
        alt="Confiance Mobilité"
        style={{ height: h }}
        className="object-contain block"
      />
    </div>
  );
}
