import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatCard } from "../../components/ui/StatCard";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { BarChart } from "../../components/charts/BarChart";
import { DonutChart } from "../../components/charts/DonutChart";
import { fuelByVehicleSeries, incidentsByType, vehicles, drivers, fuelEntries, incidents } from "../../lib/mock-data";
import { formatCurrency, formatDate } from "../../lib/utils";

export default function FleetDashboard() {
  const { t } = useTranslation();
  const avgConsumption = (fuelEntries.reduce((s, f) => s + f.liters, 0) / Math.max(1, fuelEntries.length)).toFixed(1);
  const fuelTotal = fuelEntries.reduce((s, f) => s + f.amount, 0);
  const availableFleet = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const maintenance = vehicles.filter((v) => v.status === "MAINTENANCE" || v.status === "OUT_OF_SERVICE").length;
  const now = new Date();
  const expiring = vehicles.filter((v) => {
    const days = (new Date(v.insuranceExpiry).getTime() - now.getTime()) / 86400000;
    return days < 60;
  });

  return (
    <div>
      <PageHeader
        title={t("dashboard.overview")}
        subtitle="Flotte · Conformité · Carburant"
        actions={<Badge tone="brand">{t("common.realtime")}</Badge>}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.fleetAvailable")} value={`${availableFleet}/${vehicles.length}`} icon={<Icon name="car" size={22} />} />
        <StatCard label="En maintenance"                    value={maintenance} icon={<Icon name="wrench" size={22} />} />
        <StatCard label={t("dashboard.kpi.driversOnShift")} value={drivers.filter((d) => d.status === "ACTIVE").length} icon={<Icon name="idcard" size={22} />} />
        <StatCard label={t("dashboard.kpi.documentsExpiring")} value={expiring.length} icon={<Icon name="file" size={22} />} footnote="< 60 j" />
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.fuelSpend")}      value={formatCurrency(fuelTotal)} icon={<Icon name="fuel" size={22} />} footnote={`${fuelEntries.length} pleins`} />
        <StatCard label={t("dashboard.kpi.avgConsumption")} value={`${avgConsumption} L`} icon={<Icon name="speedo" size={22} />} footnote="par plein" />
        <StatCard label={t("dashboard.kpi.openIncidents")}  value={incidents.filter((i) => i.status !== "CLOSED").length} icon={<Icon name="alert" size={22} />} />
        <StatCard label="Km parcourus"                       value={vehicles.reduce((s, v) => s + v.currentKm, 0).toLocaleString()} icon={<Icon name="route" size={22} />} footnote="cumul" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title={t("dashboard.charts.fuelByVehicle")} subtitle="Litres sur période" />
          <BarChart data={fuelByVehicleSeries()} horizontal />
        </Card>
        <Card>
          <CardHeader title={t("dashboard.charts.incidentsByType")} />
          <DonutChart data={incidentsByType()} />
        </Card>
      </div>

      <Card>
        <CardHeader title="Documents expirant bientôt" subtitle="Assurance, carte grise" />
        <ul className="divide-y divide-[color:var(--color-border-soft)]">
          {expiring.length === 0 && <li className="py-6 text-center text-[color:var(--color-muted)]">Aucune alerte</li>}
          {expiring.map((v) => (
            <li key={v.id} className="py-3 flex items-center gap-4">
              <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center"><Icon name="car" size={16} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-ink">{v.plate} · {v.brand} {v.model}</p>
                <p className="text-[12px] text-[color:var(--color-muted)]">Assurance expire le {formatDate(v.insuranceExpiry)}</p>
              </div>
              <Badge tone="warning">Action requise</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
