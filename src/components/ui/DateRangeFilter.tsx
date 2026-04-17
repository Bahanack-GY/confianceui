import { useTranslation } from "react-i18next";
import { Input } from "./Input";
import { cn, getPresetRange, type DatePreset, type DateRange } from "../../lib/utils";

const PRESETS: DatePreset[] = ["today", "week", "month", "custom"];

interface Props {
  preset: DatePreset;
  range: DateRange;
  onChange: (preset: DatePreset, range: DateRange) => void;
  className?: string;
}

export function DateRangeFilter({ preset, range, onChange, className }: Props) {
  const { t } = useTranslation();

  const handlePreset = (p: DatePreset) => {
    if (p === "custom") {
      onChange("custom", range.from || range.to ? range : { from: null, to: null });
    } else {
      onChange(p, getPresetRange(p));
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div className="flex rounded-[10px] border border-[color:var(--color-border)] overflow-hidden shrink-0">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePreset(p)}
            className={cn(
              "px-3 h-9 text-[12.5px] font-medium transition-colors border-r last:border-r-0 border-[color:var(--color-border)] whitespace-nowrap",
              preset === p
                ? "bg-brand-500 text-white"
                : "bg-white text-ink-soft hover:bg-[#f6f7fb]",
            )}
          >
            {t(`dateFilter.${p}`)}
          </button>
        ))}
      </div>

      {preset === "custom" && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[12px] text-[color:var(--color-muted)] shrink-0">{t("dateFilter.from")}</span>
          <Input
            type="date"
            value={range.from ?? ""}
            onChange={(e) => onChange("custom", { ...range, from: e.target.value || null })}
            className="h-9 w-36 text-[12.5px]"
          />
          <span className="text-[12px] text-[color:var(--color-muted)] shrink-0">{t("dateFilter.to")}</span>
          <Input
            type="date"
            value={range.to ?? ""}
            onChange={(e) => onChange("custom", { ...range, to: e.target.value || null })}
            className="h-9 w-36 text-[12.5px]"
          />
        </div>
      )}
    </div>
  );
}
