import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { LineChart } from "../../components/charts/LineChart";
import { BarChart } from "../../components/charts/BarChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import {
  revenueSeries, weeklyRevenueTotals, zonalStats, revenueByZone,
  tripOutcomeSplit, fleetStatusSplit, fuelEntries, PICKUP_ZONES,
} from "../../lib/mock-data";
import { formatCurrency, percent, getPresetRange } from "../../lib/utils";
import type { DatePreset, DateRange } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { ZoneStat } from "../../lib/mock-data";

const DEFAULT_PRESET: DatePreset = "week";

// Donut palette: outcome colours
const OUTCOME_COLORS  = ["#10b981", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444", "#94a3b8"];
const FLEET_COLORS    = ["#10b981", "#6366f1", "#f59e0b", "#ef4444"];
const REVENUE_COLOR   = "#091c53";
const COST_COLOR      = "#d97706";
const MARGIN_COLOR    = "#10b981";

export default function ExecutiveDashboard() {
  const { t } = useTranslation();

  const [preset, setPreset] = useState<DatePreset>(DEFAULT_PRESET);
  const [range, setRange]   = useState<DateRange>(getPresetRange(DEFAULT_PRESET));
  const [zone, setZone]     = useState<string | null>(null);

  const kpi     = useMemo(() => weeklyRevenueTotals(), []);
  const series  = useMemo(() => revenueSeries(), []);
  const zones   = useMemo(() => zonalStats(), []);
  const byZone  = useMemo(() => revenueByZone(), []);
  const outcomes = useMemo(() => tripOutcomeSplit(), []);
  const fleet   = useMemo(() => fleetStatusSplit(), []);

  const fuelTotal   = fuelEntries.reduce((s, f) => s + f.amount, 0);
  const fuelRatio   = fuelTotal / Math.max(1, kpi.revenue);
  const selectedZone = zone ? zones.find((z) => z.zone === zone) : null;

  return (
    <div>
      <PageHeader
        title={t("executive.title")}
        subtitle={t("executive.subtitle")}
        actions={<Badge tone="brand">{t("common.realtime")}</Badge>}
      />

      {/* Period filter */}
      <Card className="mb-6">
        <DateRangeFilter preset={preset} range={range} onChange={(p, r) => { setPreset(p); setRange(r); }} />
      </Card>

      {/* ── Financial KPIs ─────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label={t("executive.revenue")}
          value={formatCurrency(kpi.revenue)}
          icon={<Icon name="chart" size={22} />}
          delta={{ value: "+11.4%", direction: "up", tone: "positive" }}
          footnote="7 jours"
        />
        <StatCard
          label={t("executive.opCost")}
          value={formatCurrency(kpi.cost)}
          icon={<Icon name="money" size={22} />}
          delta={{ value: "+3.1%", direction: "up", tone: "negative" }}
          footnote="7 jours"
        />
        <StatCard
          label={t("executive.margin")}
          value={formatCurrency(kpi.margin)}
          icon={<Icon name="check" size={22} />}
          delta={{ value: percent(kpi.marginRate), direction: "up", tone: "positive" }}
          footnote="taux de marge"
        />
        <StatCard
          label={t("executive.revenuePerTrip")}
          value={formatCurrency(kpi.revenuePerTrip)}
          icon={<Icon name="route" size={22} />}
          footnote="/ course complétée"
        />
      </div>

      {/* ── Secondary KPIs ─────────────────────────────────────────────── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard
          label={t("dashboard.kpi.fuelSpend")}
          value={formatCurrency(fuelTotal)}
          icon={<Icon name="fuel" size={22} />}
          footnote={`${fuelEntries.length} pleins`}
        />
        <StatCard
          label={t("executive.fuelAsRevenue")}
          value={percent(fuelRatio)}
          icon={<Icon name="fuel" size={22} />}
          delta={{ value: fuelRatio < 0.15 ? "Excellent" : fuelRatio < 0.25 ? "Correct" : "Élevé", direction: fuelRatio < 0.2 ? "down" : "up", tone: fuelRatio < 0.2 ? "positive" : "negative" }}
        />
        <StatCard
          label={t("dashboard.kpi.successRate")}
          value={percent(kpi.revenue / Math.max(1, kpi.revenue + kpi.cost) * 1.5, 0)}
          icon={<Icon name="check" size={22} />}
          delta={{ value: "+2.4%", direction: "up", tone: "positive" }}
        />
        <StatCard
          label={t("dashboard.kpi.openIncidents")}
          value={2}
          icon={<Icon name="alert" size={22} />}
          footnote="5 au total"
        />
      </div>

      {/* ── Revenue vs Costs chart + Trip outcomes ─────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("executive.revenueCostChart")}
            subtitle="Revenu · Coût · Marge"
            action={<Badge tone="success">{percent(kpi.marginRate)} marge</Badge>}
          />
          <LineChart
            data={series}
            xKey="day"
            series={[
              { key: "revenue", name: t("executive.revenue"), color: REVENUE_COLOR },
              { key: "cost",    name: t("executive.opCost"),  color: COST_COLOR },
              { key: "margin",  name: t("executive.margin"),  color: MARGIN_COLOR },
            ]}
            height={280}
          />
        </Card>

        <Card>
          <CardHeader title={t("executive.tripOutcomes")} />
          <DonutChart data={outcomes} colors={OUTCOME_COLORS} />
        </Card>
      </div>

      {/* ── Zonal Analysis ─────────────────────────────────────────────── */}
      <Card className="mb-6" padded={false}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-[color:var(--color-border-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[15px] font-semibold text-ink">{t("executive.zonal.title")}</h3>
              <p className="text-[13px] text-muted mt-0.5">{t("executive.zonal.subtitle")}</p>
            </div>
            {zone && (
              <button
                type="button"
                onClick={() => setZone(null)}
                className="inline-flex items-center gap-1.5 text-[12.5px] text-brand-500 hover:underline"
              >
                <Icon name="close" size={13} />
                {t("executive.zonal.allZones")}
              </button>
            )}
          </div>

          {/* Zone pills */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setZone(null)}
              className={cn(
                "h-8 px-3 rounded-full text-[12.5px] font-medium border transition-colors",
                !zone
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-ink-soft border-[color:var(--color-border)] hover:border-brand-400",
              )}
            >
              {t("executive.zonal.allZones")}
            </button>
            {PICKUP_ZONES.map((z) => {
              const stat = zones.find((s) => s.zone === z);
              return (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZone(zone === z ? null : z)}
                  className={cn(
                    "h-8 px-3 rounded-full text-[12.5px] font-medium border transition-colors inline-flex items-center gap-1.5",
                    zone === z
                      ? "bg-brand-500 text-white border-brand-500"
                      : "bg-white text-ink-soft border-[color:var(--color-border)] hover:border-brand-400",
                  )}
                >
                  {z}
                  {stat && (
                    <span className={cn(
                      "text-[11px] rounded-full px-1.5",
                      zone === z ? "bg-white/20 text-white" : "bg-[#f1f3f8] text-muted",
                    )}>
                      {stat.totalTrips}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone detail highlight */}
        {selectedZone && (
          <div className="px-5 py-4 bg-brand-50 border-b border-brand-100">
            <ZoneDetailPanel zone={selectedZone} t={t} />
          </div>
        )}

        {/* Zone table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[color:var(--color-border-soft)]">
                {[
                  t("executive.zonal.zone"),
                  t("executive.zonal.totalTrips"),
                  t("executive.zonal.completed"),
                  t("executive.zonal.cancelled"),
                  t("executive.zonal.completionRate"),
                  t("executive.zonal.revenue"),
                  t("executive.zonal.avgRevenue"),
                  t("executive.zonal.incidents"),
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11.5px] font-semibold text-muted uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-border-soft)]">
              {zones.map((z) => {
                const isSelected = zone === z.zone;
                return (
                  <tr
                    key={z.zone}
                    onClick={() => setZone(zone === z.zone ? null : z.zone)}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isSelected ? "bg-brand-50" : "hover:bg-[#fafbfc]",
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "h-2 w-2 rounded-full shrink-0",
                          isSelected ? "bg-brand-500" : "bg-[#e4e7ee]",
                        )} />
                        <span className={cn("font-medium", isSelected && "text-brand-600")}>{z.zone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 tabular-nums">{z.totalTrips}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-success-600 font-medium">
                        <Icon name="check" size={12} />
                        {z.completed}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-danger-500 tabular-nums">{z.cancelled}</td>
                    <td className="px-4 py-3">
                      <CompletionBar rate={z.completionRate} />
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium text-ink">
                      {formatCurrency(z.revenue)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted">
                      {z.completed > 0 ? formatCurrency(z.avgRevenue) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      {z.incidents > 0
                        ? <Badge tone="warning">{z.incidents}</Badge>
                        : <span className="text-muted">{t("executive.zonal.noIncidents")}</span>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── Revenue by zone bar + Fleet utilisation ──────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title={t("executive.revenueByZone")}
            subtitle="Courses complétées · FCFA"
          />
          <BarChart
            data={byZone.filter((d) => d.value > 0)}
            color={REVENUE_COLOR}
            horizontal
            height={220}
          />
        </Card>

        <Card>
          <CardHeader
            title={t("executive.fleetUtil")}
            subtitle="Répartition actuelle des véhicules"
          />
          <DonutChart data={fleet} colors={FLEET_COLORS} />
        </Card>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ZoneDetailPanel({ zone, t }: { zone: ZoneStat; t: (k: string) => string }) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-brand-500 uppercase tracking-wide mb-3">
        {t("executive.zonal.detailTitle")} · {zone.zone}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: t("executive.zonal.totalTrips"), value: zone.totalTrips, icon: "route" },
          { label: t("executive.zonal.completed"),  value: zone.completed,  icon: "check" },
          { label: t("executive.zonal.cancelled"),  value: zone.cancelled,  icon: "close" },
          { label: t("executive.zonal.completionRate"), value: percent(zone.completionRate), icon: "chart" },
          { label: t("executive.revenue"),          value: formatCurrency(zone.revenue),    icon: "money" },
          { label: t("executive.zonal.incidents"),  value: zone.incidents || t("executive.zonal.noIncidents"), icon: "alert" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-white rounded-[10px] px-3 py-2.5 border border-brand-100">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon name={icon} size={12} className="text-brand-400" />
              <span className="text-[11px] text-muted uppercase tracking-wide">{label}</span>
            </div>
            <p className="text-[15px] font-semibold text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CompletionBar({ rate }: { rate: number }) {
  const pct = Math.round(rate * 100);
  const color = pct >= 70 ? "#10b981" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 rounded-full bg-[#f1f3f8] overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="tabular-nums text-[12px] w-8 text-right" style={{ color }}>{pct}%</span>
    </div>
  );
}
