import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { Table } from "../../components/ui/Table";
import { vehicles, drivers } from "../../lib/mock-data";
import { formatDate, oilChangeStatus } from "../../lib/utils";

function daysUntil(d: string) {
  return Math.round((new Date(d).getTime() - Date.now()) / 86400000);
}

function tone(days: number): "success" | "warning" | "danger" {
  if (days < 0) return "danger";
  if (days < 60) return "warning";
  return "success";
}

export default function Compliance() {
  const { t } = useTranslation();

  const vehicleRows = vehicles.flatMap((v) => [
    { id: `${v.id}-ins`, kind: "Assurance",   entity: `${v.plate} · ${v.brand} ${v.model}`, expiry: v.insuranceExpiry },
    { id: `${v.id}-reg`, kind: "Carte grise", entity: `${v.plate} · ${v.brand} ${v.model}`, expiry: v.registrationExpiry },
  ]).sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  const driverRows = drivers.map((d) => ({ id: d.id, kind: "Permis", entity: `${d.name} · ${d.employeeId}`, expiry: d.licenseExpiry }))
    .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  return (
    <div>
      <PageHeader title={t("nav.compliance")} subtitle="Documents et expirations" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padded={false}>
          <CardHeader className="px-5 pt-5" title="Véhicules" subtitle="Assurance & carte grise" action={<Icon name="car" size={18} className="text-brand-500" />} />
          <Table
            rowKey={(r) => r.id}
            rows={vehicleRows}
            columns={[
              { key: "k", header: "Type",     cell: (r) => <Badge tone="neutral">{r.kind}</Badge> },
              { key: "e", header: "Véhicule", cell: (r) => <span className="font-medium">{r.entity}</span> },
              { key: "d", header: "Expire",   cell: (r) => formatDate(r.expiry) },
              { key: "s", header: "Statut",   cell: (r) => {
                const days = daysUntil(r.expiry);
                return <Badge tone={tone(days)}>{days < 0 ? `Expiré (${Math.abs(days)}j)` : `Dans ${days}j`}</Badge>;
              }},
            ]}
          />
        </Card>

        <Card padded={false}>
          <CardHeader className="px-5 pt-5" title="Chauffeurs" subtitle="Permis de conduire" action={<Icon name="idcard" size={18} className="text-brand-500" />} />
          <Table
            rowKey={(r) => r.id}
            rows={driverRows}
            columns={[
              { key: "k", header: "Type",      cell: (r) => <Badge tone="neutral">{r.kind}</Badge> },
              { key: "e", header: "Chauffeur", cell: (r) => <span className="font-medium">{r.entity}</span> },
              { key: "d", header: "Expire",    cell: (r) => formatDate(r.expiry) },
              { key: "s", header: "Statut",    cell: (r) => {
                const days = daysUntil(r.expiry);
                return <Badge tone={tone(days)}>{days < 0 ? `Expiré (${Math.abs(days)}j)` : `Dans ${days}j`}</Badge>;
              }},
            ]}
          />
        </Card>
      </div>

      {/* ── Oil change tracking ─────────────────────────────────────────── */}
      <Card padded={false} className="mt-6">
        <CardHeader
          className="px-5 pt-5"
          title={t("vehicle.oilChange.section")}
          subtitle={t("vehicle.oilChange.sectionSub")}
          action={<Icon name="wrench" size={18} className="text-brand-500" />}
        />
        <Table
          rowKey={(r) => r.id}
          rows={vehicles}
          columns={[
            { key: "plate", header: t("vehicle.fields.plate"), cell: (r) => (
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                  <Icon name="car" size={13} />
                </span>
                <span className="font-medium">{r.plate} · {r.brand} {r.model}</span>
              </div>
            )},
            { key: "last", header: t("vehicle.fields.lastOilChange"), cell: (r) =>
              r.lastOilChange ? formatDate(r.lastOilChange) : <span className="text-muted">—</span>
            },
            { key: "days", header: t("vehicle.oilChange.daysSince"), cell: (r) => {
              if (!r.lastOilChange) return <span className="text-muted">—</span>;
              const days = Math.round((Date.now() - new Date(r.lastOilChange).getTime()) / 86400000);
              return <span className={`tabular-nums ${days > 75 ? "text-warning-500 font-medium" : ""} ${days > 90 ? "text-danger-500" : ""}`}>{days}j</span>;
            }},
            { key: "kmLast", header: t("vehicle.fields.kmAtLastOilChange"), cell: (r) =>
              r.kmAtLastOilChange ? <span className="tabular-nums">{r.kmAtLastOilChange.toLocaleString()} km</span> : <span className="text-muted">—</span>
            },
            { key: "kmSince", header: t("vehicle.oilChange.kmSince"), cell: (r) => {
              if (!r.kmAtLastOilChange) return <span className="text-muted">—</span>;
              const km = r.currentKm - r.kmAtLastOilChange;
              return <span className={`tabular-nums ${km > 4500 ? "text-warning-500 font-medium" : ""} ${km > 5000 ? "text-danger-500" : ""}`}>{km.toLocaleString()} km</span>;
            }},
            { key: "next", header: t("vehicle.fields.nextOilChangeKm"), cell: (r) =>
              r.kmAtLastOilChange
                ? <span className="tabular-nums font-medium text-ink">{(r.kmAtLastOilChange + 5000).toLocaleString()} km</span>
                : <span className="text-muted">—</span>
            },
            { key: "st", header: t("common.status"), cell: (r) => {
              const st = oilChangeStatus(r);
              const label = t(`vehicle.oilChange.${st}`);
              const tone = st === "ok" ? "success" : st === "due_soon" ? "warning" : "danger";
              return <Badge tone={tone}>{label}</Badge>;
            }},
          ]}
        />
      </Card>
    </div>
  );
}
