import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { Icon } from "../../components/layout/Icon";
import { vehicles, drivers, fuelEntries, incidents, checklists } from "../../lib/mock-data";
import { formatDate, formatCurrency, oilChangeStatus } from "../../lib/utils";
import { Table } from "../../components/ui/Table";

export default function VehicleDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const v = vehicles.find((x) => x.id === id);
  if (!v) return <div className="p-6 text-center text-[color:var(--color-muted)]">Véhicule introuvable</div>;
  const vFuel = fuelEntries.filter((f) => f.vehicleId === v.id);
  const vInc  = incidents.filter((i) => i.vehicleId === v.id);
  const vChk  = checklists.filter((c) => c.vehicleId === v.id);
  const fuelLiters = vFuel.reduce((s, f) => s + f.liters, 0);
  const fuelAmount = vFuel.reduce((s, f) => s + f.amount, 0);
  const driver = drivers.find((d) => d.id === v.assignedDriverId);

  return (
    <div>
      <PageHeader
        title={`${v.plate} · ${v.brand} ${v.model}`}
        subtitle={`${v.year} · ${t(`vehicle.fields.fuelType`)} ${v.fuelType}`}
        actions={
          <>
            <Link to="/fleet/vehicles"><Button variant="outline" leftIcon={<Icon name="left" size={16} />}>{t("common.back")}</Button></Link>
            <Button leftIcon={<Icon name="edit" size={16} />}>{t("common.edit")}</Button>
          </>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("common.status")} value={<Badge tone="brand">{t(`vehicle.status.${v.status}`)}</Badge>} icon={<Icon name="car" size={22} />} />
        <StatCard label="KM actuel"  value={`${v.currentKm.toLocaleString()} km`} icon={<Icon name="route" size={22} />} />
        <StatCard label="Carburant"  value={`${fuelLiters} L`} icon={<Icon name="fuel" size={22} />} footnote={formatCurrency(fuelAmount)} />
        <StatCard label={t("dashboard.kpi.openIncidents")} value={vInc.length} icon={<Icon name="alert" size={22} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Informations" />
          <dl className="text-[13.5px] divide-y divide-[color:var(--color-border-soft)]">
            <Row label={t("vehicle.fields.plate")}   value={v.plate} />
            <Row label={t("vehicle.fields.brand")}   value={v.brand} />
            <Row label={t("vehicle.fields.model")}   value={v.model} />
            <Row label={t("vehicle.fields.year")}    value={v.year} />
            <Row label={t("vehicle.fields.fuelType")}value={v.fuelType} />
            <Row label="État"                         value={v.condition === "new" ? "Neuf" : "Occasion"} />
            <Row label="KM initial"                   value={<span className="tabular-nums">{v.initialKm.toLocaleString()} km</span>} />
            <Row label={t("vehicle.fields.driver")}  value={driver?.name ?? "—"} />
            <Row label={t("vehicle.fields.insuranceExpiry")}    value={formatDate(v.insuranceExpiry)} />
            <Row label={t("vehicle.fields.registrationExpiry")} value={formatDate(v.registrationExpiry)} />
            <Row label={t("vehicle.fields.lastOilChange")}      value={
              v.lastOilChange ? (
                <span className="flex items-center gap-2">
                  {formatDate(v.lastOilChange)}
                  {(() => { const st = oilChangeStatus(v); const tone = st === "ok" ? "success" : st === "due_soon" ? "warning" : "danger"; return <Badge tone={tone}>{t(`vehicle.oilChange.${st}`)}</Badge>; })()}
                </span>
              ) : "—"
            } />
            <Row label={t("vehicle.fields.kmAtLastOilChange")}  value={v.kmAtLastOilChange ? <span className="tabular-nums">{v.kmAtLastOilChange.toLocaleString()} km</span> : "—"} />
            <Row label={t("vehicle.fields.nextOilChangeKm")}    value={v.kmAtLastOilChange ? <span className="tabular-nums font-medium">{(v.kmAtLastOilChange + 5000).toLocaleString()} km</span> : "—"} />
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Derniers pleins" action={<Button size="sm" variant="outline" leftIcon={<Icon name="plus" size={14} />}>{t("fuel.new")}</Button>} />
          <Table
            rowKey={(r) => r.id}
            rows={vFuel}
            columns={[
              { key: "d",  header: t("common.date"), cell: (r) => formatDate(r.date) },
              { key: "l",  header: t("fuel.fields.liters"), cell: (r) => <span className="tabular-nums">{r.liters} L</span>, align: "right" },
              { key: "a",  header: t("fuel.fields.amount"), cell: (r) => <span className="tabular-nums">{formatCurrency(r.amount)}</span>, align: "right" },
              { key: "km", header: t("fuel.fields.km"),     cell: (r) => <span className="tabular-nums">{r.kmReading.toLocaleString()}</span>, align: "right" },
              { key: "s",  header: t("fuel.fields.station"),cell: (r) => r.station ?? "—" },
            ]}
          />
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Incidents liés" />
          <Table
            rowKey={(r) => r.id}
            rows={vInc}
            columns={[
              { key: "ref",   header: "Réf", cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">#{r.ref}</span> },
              { key: "date",  header: t("common.date"), cell: (r) => formatDate(r.date) },
              { key: "type",  header: t("incident.fields.type"), cell: (r) => <Badge tone="warning">{t(`incident.type.${r.type}`)}</Badge> },
              { key: "desc",  header: "Description", cell: (r) => <span className="line-clamp-1 block max-w-[320px]">{r.description}</span> },
              { key: "st",    header: t("common.status"), cell: (r) => <Badge tone={r.status === "CLOSED" ? "success" : "warning"}>{t(`incident.status.${r.status}`)}</Badge> },
            ]}
            empty="Aucun incident"
          />
        </Card>

        <Card>
          <CardHeader title="Dernières check-lists" />
          <ul className="divide-y divide-[color:var(--color-border-soft)]">
            {vChk.length === 0 && <li className="py-6 text-center text-[color:var(--color-muted)]">Aucune</li>}
            {vChk.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium">{formatDate(c.date)}</p>
                  <p className="text-[12px] text-[color:var(--color-muted)]">KM {c.kmStart.toLocaleString()}</p>
                </div>
                <Badge tone={[c.bodyCondition, c.tires, c.levels, c.lights, c.cleanliness, c.documents].every((x) => x === "OK") ? "success" : "warning"}>
                  {[c.bodyCondition, c.tires, c.levels, c.lights, c.cleanliness, c.documents].every((x) => x === "OK") ? "Conforme" : "À vérifier"}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[color:var(--color-muted)]">{label}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
