import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { Table } from "../../components/ui/Table";
import { vehicles, drivers } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";

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
    </div>
  );
}
