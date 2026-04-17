import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { Avatar } from "../../components/ui/Avatar";
import { Icon } from "../../components/layout/Icon";
import { Table } from "../../components/ui/Table";
import { drivers, vehicles, trips, incidents, driverSheets } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";

export default function DriverDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const d = drivers.find((x) => x.id === id);
  if (!d) return <div className="p-6 text-center text-[color:var(--color-muted)]">Chauffeur introuvable</div>;

  const dTrips = trips.filter((tr) => tr.driverId === d.id);
  const dInc = incidents.filter((i) => i.driverId === d.id);
  const dSheets = driverSheets.filter((s) => s.driverId === d.id);
  const assignedVehicle = vehicles.find((v) => v.assignedDriverId === d.id);

  return (
    <div>
      <PageHeader
        title={d.name}
        subtitle={`${d.employeeId} · ${d.phone}`}
        actions={
          <>
            <Link to="/fleet/drivers"><Button variant="outline" leftIcon={<Icon name="left" size={16} />}>{t("common.back")}</Button></Link>
            <Button leftIcon={<Icon name="edit" size={16} />}>{t("common.edit")}</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card>
          <div className="flex flex-col items-center text-center py-4">
            <Avatar name={d.name} size="lg" />
            <h3 className="mt-3 text-[16px] font-semibold text-ink">{d.name}</h3>
            <p className="text-[12.5px] text-[color:var(--color-muted)]">{t("driver.title")}</p>
            <Badge tone={d.status === "ACTIVE" ? "success" : d.status === "ON_LEAVE" ? "warning" : "danger"} className="mt-3">{t(`driver.status.${d.status}`)}</Badge>
          </div>
          <dl className="text-[13.5px] divide-y divide-[color:var(--color-border-soft)] mt-2">
            <Row label={t("driver.fields.driverId")} value={d.employeeId} />
            <Row label={t("common.phone")}            value={d.phone} />
            <Row label="Embauché le"                   value={formatDate(d.hiredAt)} />
            <Row label="Permis expire"                 value={formatDate(d.licenseExpiry)} />
            <Row label="Véhicule assigné"              value={assignedVehicle?.plate ?? "—"} />
            <Row label="Note"                          value={<span className="inline-flex items-center gap-1"><Icon name="star" size={14} className="text-warning-500" />{d.rating.toFixed(1)}</span>} />
          </dl>
        </Card>

        <div className="space-y-6">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
            <StatCard label="Courses totales" value={dTrips.length} icon={<Icon name="route" size={22} />} />
            <StatCard label="Incidents"       value={dInc.length}   icon={<Icon name="alert" size={22} />} />
            <StatCard label="Fiches"          value={dSheets.length} icon={<Icon name="clipboard" size={22} />} />
          </div>

          <Card padded={false}>
            <CardHeader className="px-5 pt-5" title="Fiches journalières" />
            <Table
              rowKey={(r) => r.id}
              rows={dSheets}
              columns={[
                { key: "d",   header: t("common.date"),          cell: (r) => formatDate(r.date) },
                { key: "sh",  header: t("shift.slot"),           cell: (r) => <Badge tone="brand">{t(`shift.${r.shiftSlot}`)}</Badge> },
                { key: "tr",  header: t("driver.fields.trips"),  cell: (r) => r.trips, align: "right" },
                { key: "ac",  header: t("driver.fields.accepted"),  cell: (r) => r.accepted, align: "right" },
                { key: "rf",  header: t("driver.fields.refused"),   cell: (r) => r.refused,  align: "right" },
                { key: "cn",  header: t("driver.fields.cancelled"), cell: (r) => r.cancelled,align: "right" },
                { key: "inc", header: t("driver.fields.incidents"), cell: (r) => r.incidents,align: "right" },
              ]}
              empty="Aucune fiche"
            />
          </Card>

          <Card padded={false}>
            <CardHeader className="px-5 pt-5" title="Incidents" />
            <Table
              rowKey={(r) => r.id}
              rows={dInc}
              columns={[
                { key: "ref",  header: "Réf", cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">#{r.ref}</span> },
                { key: "d",    header: t("common.date"), cell: (r) => formatDate(r.date) },
                { key: "type", header: t("incident.fields.type"), cell: (r) => <Badge tone="warning">{t(`incident.type.${r.type}`)}</Badge> },
                { key: "st",   header: t("common.status"), cell: (r) => <Badge tone={r.status === "CLOSED" ? "success" : "warning"}>{t(`incident.status.${r.status}`)}</Badge> },
              ]}
              empty="Aucun incident"
            />
          </Card>
        </div>
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
