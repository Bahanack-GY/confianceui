import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { StatCard } from "../../components/ui/StatCard";
import { Icon } from "../../components/layout/Icon";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import { trips, driverSheets, drivers, incidents, vehicles } from "../../lib/mock-data";
import { useAuth } from "../../lib/auth";
import { LineChart } from "../../components/charts/LineChart";
import { formatDate, getPresetRange, inDateRange } from "../../lib/utils";
import type { TripStatus } from "../../types";
import type { DatePreset, DateRange } from "../../lib/utils";

const STATUS_TONE: Record<TripStatus, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "neutral", ASSIGNED: "info", IN_PROGRESS: "brand",
  COMPLETED: "success", CANCELLED: "warning", REFUSED: "danger",
};

const DEFAULT_PRESET: DatePreset = "month";

export default function Activity() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const me = drivers.find((d) => d.email === user?.email) ?? drivers[0];

  const [preset, setPreset] = useState<DatePreset>(DEFAULT_PRESET);
  const [range, setRange] = useState<DateRange>(getPresetRange(DEFAULT_PRESET));

  const handleDateChange = (p: DatePreset, r: DateRange) => {
    setPreset(p);
    setRange(r);
  };

  const allMyTrips = trips.filter((tr) => tr.driverId === me.id);
  const mySheets = driverSheets.filter((s) => s.driverId === me.id);
  const myInc = incidents.filter((i) => i.driverId === me.id);

  const myTrips = useMemo(
    () => allMyTrips.filter((tr) => inDateRange(tr.requestedAt, range)),
    [range],
  );

  const completed = myTrips.filter((tr) => tr.status === "COMPLETED").length;
  const cancelled = myTrips.filter((tr) => tr.status === "CANCELLED").length;

  const series = Array.from({ length: 7 }).map((_, i) => ({
    day: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"][i],
    courses: 6 + ((i * 3) % 8),
  }));

  return (
    <div>
      <PageHeader title={t("nav.myActivity")} subtitle={me.name} />

      <Card className="mb-6">
        <DateRangeFilter preset={preset} range={range} onChange={handleDateChange} />
      </Card>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Courses totales" value={myTrips.length} icon={<Icon name="route" size={22} />} />
        <StatCard label="Terminées"        value={completed}      icon={<Icon name="check" size={22} />} />
        <StatCard label="Annulées"         value={cancelled}      icon={<Icon name="close" size={22} />} />
        <StatCard label="Incidents"        value={myInc.length}   icon={<Icon name="alert" size={22} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Courses par jour" subtitle="7 derniers jours" />
          <LineChart data={series} xKey="day" series={[{ key: "courses", name: "Courses", color: "#091c53" }]} />
        </Card>
        <Card>
          <CardHeader title="Qualité de service" />
          <ul className="space-y-3 text-[13.5px]">
            {(["Ponctualité","Présentation","Respect des règles"] as const).map((k) => (
              <li key={k}>
                <div className="flex items-center justify-between mb-1"><span>{k}</span><span className="tabular-nums text-muted">4.8/5</span></div>
                <div className="h-1.5 rounded-full bg-[#f1f3f8] overflow-hidden"><div className="h-full bg-brand-500" style={{ width: "96%" }} /></div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card padded={false} className="mb-6">
        <CardHeader className="px-5 pt-5" title="Mes fiches journalières" />
        <Table
          rowKey={(r) => r.id}
          rows={mySheets}
          columns={[
            { key: "d",   header: t("common.date"), cell: (r) => formatDate(r.date) },
            { key: "sh",  header: t("shift.slot"),  cell: (r) => <Badge tone="brand">{t(`shift.${r.shiftSlot}`)}</Badge> },
            { key: "vh",  header: t("vehicle.fields.plate"), cell: (r) => vehicles.find((v) => v.id === r.vehicleId)?.plate ?? "—" },
            { key: "tr",  header: t("driver.fields.trips"), cell: (r) => r.trips, align: "right" },
            { key: "ac",  header: t("driver.fields.accepted"), cell: (r) => r.accepted, align: "right" },
            { key: "cm",  header: t("driver.fields.supervisorComment"), cell: (r) => <span className="text-[13px] text-ink-soft line-clamp-1 max-w-[280px] block">{r.supervisorComment ?? "—"}</span> },
          ]}
          empty="Aucune fiche"
        />
      </Card>

      <Card padded={false}>
        <CardHeader className="px-5 pt-5" title="Mes courses récentes" subtitle={`${myTrips.length} course(s)`} />
        <Table
          rowKey={(r) => r.id}
          rows={myTrips}
          columns={[
            { key: "id",     header: "ID",     cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">{r.id}</span> },
            { key: "client", header: "Client", cell: (r) => r.clientName },
            { key: "trip",   header: "Trajet", cell: (r) => <span>{r.pickup} → {r.dropoff}</span> },
            { key: "date",   header: t("common.date"), cell: (r) => formatDate(r.requestedAt) },
            { key: "st",     header: t("common.status"), cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{t(`trip.status.${r.status}`)}</Badge> },
          ]}
          empty={t("dateFilter.noResults") as string}
        />
      </Card>
    </div>
  );
}
