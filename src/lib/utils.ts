import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number, locale = "fr-FR") {
  return new Intl.NumberFormat(locale).format(n);
}

export function formatCurrency(n: number, locale = "fr-FR", currency = "XAF") {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

export function formatDate(d: Date | string, locale = "fr-FR") {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function formatDateTime(d: Date | string, locale = "fr-FR") {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

export function percent(n: number, digits = 1) {
  return `${(n * 100).toFixed(digits)}%`;
}

export type DatePreset = "today" | "week" | "month" | "custom";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export function getPresetRange(preset: DatePreset): DateRange {
  const now = new Date();
  const to = now.toISOString().slice(0, 10);
  if (preset === "today") return { from: to, to };
  if (preset === "week") {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    return { from: d.toISOString().slice(0, 10), to };
  }
  if (preset === "month") {
    return { from: `${to.slice(0, 7)}-01`, to };
  }
  return { from: null, to: null };
}

export function inDateRange(dateStr: string, range: DateRange): boolean {
  if (!range.from && !range.to) return true;
  const d = dateStr.slice(0, 10);
  if (range.from && d < range.from) return false;
  if (range.to && d > range.to) return false;
  return true;
}

export function generateCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const esc = (v: string | number | null | undefined): string => {
    const s = String(v ?? "");
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers, ...rows].map((row) => row.map(esc).join(",")).join("\n");
}

export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function oilChangeStatus(v: { currentKm: number; lastOilChange?: string; kmAtLastOilChange?: number }): "ok" | "due_soon" | "overdue" {
  const daysSince = v.lastOilChange ? (Date.now() - new Date(v.lastOilChange).getTime()) / 86400000 : Infinity;
  const kmSince   = v.kmAtLastOilChange != null ? v.currentKm - v.kmAtLastOilChange : Infinity;
  if (daysSince > 90 || kmSince > 5000) return "overdue";
  if (daysSince > 75 || kmSince > 4500) return "due_soon";
  return "ok";
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}
