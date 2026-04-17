import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import { LineChart } from "../../components/charts/LineChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { cancelReasonShares, incidentsByType, kpiSeriesTrips, trips, incidents, drivers, vehicles } from "../../lib/mock-data";
import { formatDateTime, getPresetRange, inDateRange, percent } from "../../lib/utils";
import type { DatePreset, DateRange } from "../../lib/utils";

interface Props {
  newReportPath: string;
  reportIncidentPath: string;
  title?: string;
  subtitle?: string;
}

const DEFAULT_PRESET: DatePreset = "week";

export default function DispatchDashboard({ newReportPath, reportIncidentPath, title, subtitle }: Props) {
  const { t } = useTranslation();

  const [preset, setPreset] = useState<DatePreset>(DEFAULT_PRESET);
  const [range, setRange] = useState<DateRange>(getPresetRange(DEFAULT_PRESET));

  const handleDateChange = (p: DatePreset, r: DateRange) => {
    setPreset(p);
    setRange(r);
  };

  const filtered = useMemo(
    () => trips.filter((tr) => inDateRange(tr.requestedAt, range)),
    [range],
  );

  const totalTrips     = filtered.length;
  const success        = filtered.filter((t) => t.status === "COMPLETED").length;
  const cancelled      = filtered.filter((t) => t.status === "CANCELLED").length;
  const openIncidents  = incidents.filter((i) => i.status !== "CLOSED").length;
  const availableFleet = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const activeDrivers  = drivers.filter((d) => d.status === "ACTIVE").length;
  const successRate    = success / Math.max(1, totalTrips);
  const cancelRate     = cancelled / Math.max(1, totalTrips);

  const recentTrips = [...filtered].slice(0, 6);

  return (
    <div>
      <PageHeader
        title={title ?? t("dashboard.overview")}
        subtitle={subtitle ?? new Date().toLocaleDateString(undefined, { dateStyle: "full" })}
        actions={
          <>
            <Link to={reportIncidentPath}><Button variant="outline" leftIcon={<Icon name="alert" size={16} />}>{t("nav.reportIncident")}</Button></Link>
            <Link to={newReportPath}><Button leftIcon={<Icon name="plus" size={16} />}>{t("shiftReport.new")}</Button></Link>
          </>
        }
      />

      <Card className="mb-6">
        <DateRangeFilter preset={preset} range={range} onChange={handleDateChange} />
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.totalTrips")}    value={totalTrips}           icon={<Icon name="route" size={22} />} delta={{ value: "+8%", direction: "up", tone: "positive" }} footnote="vs. hier" />
        <StatCard label={t("dashboard.kpi.successRate")}   value={percent(successRate, 1)} icon={<Icon name="check" size={22} />} delta={{ value: "+2.4%", direction: "up", tone: "positive" }} />
        <StatCard label={t("dashboard.kpi.cancelRate")}    value={percent(cancelRate, 1)}  icon={<Icon name="close" size={22} />} delta={{ value: "-0.8%", direction: "down", tone: "positive" }} />
        <StatCard label={t("dashboard.kpi.openIncidents")} value={openIncidents}        icon={<Icon name="alert" size={22} />} footnote={`${incidents.length} au total`} />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.avgWaitTime")}    value="6.4 min" icon={<Icon name="clock" size={22} />} />
        <StatCard label={t("dashboard.kpi.avgAssignTime")}  value="2.1 min" icon={<Icon name="time" size={22} />} />
        <StatCard label={t("dashboard.kpi.fleetAvailable")} value={`${availableFleet}/${vehicles.length}`} icon={<Icon name="car" size={22} />} />
        <StatCard label={t("dashboard.kpi.driversOnShift")} value={activeDrivers} icon={<Icon name="idcard" size={22} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title={t("dashboard.charts.tripsOverTime")}
            subtitle="7 derniers jours"
            action={<Badge tone="brand">{t("common.realtime")}</Badge>}
          />
          <LineChart
            data={kpiSeriesTrips()}
            xKey="day"
            series={[
              { key: "completed", name: t("dashboard.kpi.successfulTrips"), color: "#091c53" },
              { key: "cancelled", name: t("dashboard.kpi.cancelledTrips"), color: "#d97706" },
              { key: "refused",   name: t("dashboard.kpi.refusedTrips"),   color: "#dc2626" },
            ]}
          />
        </Card>
        <Card>
          <CardHeader title={t("dashboard.charts.cancelReasons")} subtitle="Répartition" />
          <DonutChart data={cancelReasonShares()} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Courses récentes"
            subtitle={`${recentTrips.length} course(s) sur la période`}
            action={<Badge tone="brand">{t("common.liveUpdates")}</Badge>}
          />
          {recentTrips.length === 0 ? (
            <p className="py-8 text-center text-[13px] text-muted">{t("dateFilter.noResults")}</p>
          ) : (
            <ul className="divide-y divide-border-soft">
              {recentTrips.map((tr) => (
                <li key={tr.id} className="py-3 flex items-center gap-4">
                  <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center">
                    <Icon name="route" size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-medium text-ink truncate">{tr.clientName} · {tr.pickup} → {tr.dropoff}</p>
                    <p className="text-[12px] text-muted">{formatDateTime(tr.requestedAt)}</p>
                  </div>
                  <TripStatusBadge status={tr.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader title={t("dashboard.charts.incidentsByType")} />
          <DonutChart data={incidentsByType()} />
        </Card>
      </div>
    </div>
  );
}

const TRIP_STATUS_TONE: Record<string, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "neutral", ASSIGNED: "info", IN_PROGRESS: "brand",
  COMPLETED: "success", CANCELLED: "warning", REFUSED: "danger",
};

function TripStatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  return <Badge tone={TRIP_STATUS_TONE[status] ?? "neutral"}>{t(`trip.status.${status}`)}</Badge>;
}
