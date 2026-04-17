import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { LineChart } from "../../components/charts/LineChart";
import { BarChart } from "../../components/charts/BarChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { kpiSeriesTrips, fuelByVehicleSeries, incidentsByType, trips, incidents, vehicles, drivers, fuelEntries } from "../../lib/mock-data";
import { formatCurrency, percent } from "../../lib/utils";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const totalTrips = trips.length;
  const success = trips.filter((t) => t.status === "COMPLETED").length;
  const fuelTotal = fuelEntries.reduce((s, f) => s + f.amount, 0);
  const openIncidents = incidents.filter((i) => i.status !== "CLOSED").length;
  const availableFleet = vehicles.filter((v) => v.status === "AVAILABLE").length;

  return (
    <div>
      <PageHeader
        title={t("dashboard.overview")}
        subtitle="Vue consolidée Dispatch & Flotte"
        actions={<Badge tone="brand">{t("common.realtime")}</Badge>}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.totalTrips")}    value={totalTrips} icon={<Icon name="route" size={22} />} delta={{ value: "+8%", direction: "up", tone: "positive" }} />
        <StatCard label={t("dashboard.kpi.successRate")}   value={percent(success / Math.max(1, totalTrips), 0)} icon={<Icon name="check" size={22} />} />
        <StatCard label={t("dashboard.kpi.openIncidents")} value={openIncidents} icon={<Icon name="alert" size={22} />} />
        <StatCard label={t("dashboard.kpi.fuelSpend")}     value={formatCurrency(fuelTotal)} icon={<Icon name="fuel" size={22} />} footnote={`${fuelEntries.length} pleins`} />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.fleetAvailable")} value={`${availableFleet}/${vehicles.length}`} icon={<Icon name="car" size={22} />} />
        <StatCard label={t("dashboard.kpi.driversOnShift")} value={drivers.filter((d) => d.status === "ACTIVE").length} icon={<Icon name="idcard" size={22} />} />
        <StatCard label={t("dashboard.kpi.avgWaitTime")}    value="6.4 min" icon={<Icon name="clock" size={22} />} />
        <StatCard label={t("dashboard.kpi.documentsExpiring")} value={3} icon={<Icon name="file" size={22} />} footnote="dans les 60 jours" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title={t("dashboard.charts.tripsOverTime")} />
          <LineChart data={kpiSeriesTrips()} xKey="day" series={[
            { key: "completed", name: t("dashboard.kpi.successfulTrips"), color: "#091c53" },
            { key: "cancelled", name: t("dashboard.kpi.cancelledTrips"), color: "#d97706" },
            { key: "refused",   name: t("dashboard.kpi.refusedTrips"),   color: "#dc2626" },
          ]} />
        </Card>
        <Card>
          <CardHeader title={t("dashboard.charts.incidentsByType")} />
          <DonutChart data={incidentsByType()} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title={t("dashboard.charts.fuelByVehicle")} subtitle="Litres sur période" />
          <BarChart data={fuelByVehicleSeries()} horizontal />
        </Card>
        <Card>
          <CardHeader title="Activité récente" />
          <ul className="space-y-3 text-[13.5px]">
            <li className="flex items-center gap-3"><Icon name="clipboard" size={16} className="text-brand-500" /> Rapport de shift Matin validé</li>
            <li className="flex items-center gap-3"><Icon name="alert" size={16} className="text-danger-500" /> Incident #2026-04 ouvert (Tsinga)</li>
            <li className="flex items-center gap-3"><Icon name="fuel" size={16} className="text-brand-500" /> Plein CE-001-AB · 55 L</li>
            <li className="flex items-center gap-3"><Icon name="wrench" size={16} className="text-warning-500" /> V-04 passé en maintenance</li>
            <li className="flex items-center gap-3"><Icon name="check" size={16} className="text-success-500" /> Check-list validée · CE-003-AB</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
