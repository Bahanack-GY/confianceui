import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { checklists, drivers, vehicles } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";

export default function Checklists() {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader title={t("nav.checklists")} subtitle={`${checklists.length} check-list(s)`} />
      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={checklists}
          columns={[
            { key: "date", header: t("common.date"), cell: (r) => formatDate(r.date) },
            { key: "vh",   header: t("vehicle.fields.plate"), cell: (r) => vehicles.find((v) => v.id === r.vehicleId)?.plate ?? "—" },
            { key: "drv",  header: t("driver.fields.name"),   cell: (r) => drivers.find((d) => d.id === r.driverId)?.name ?? "—" },
            { key: "km",   header: t("checklist.kmStart"),    cell: (r) => <span className="tabular-nums">{r.kmStart.toLocaleString()}</span>, align: "right" },
            ...(["bodyCondition","tires","levels","lights","cleanliness","documents"] as const).map((k) => {
              const itemKey: Record<typeof k, string> = {
                bodyCondition: "checklist.items.body",
                tires:         "checklist.items.tires",
                levels:        "checklist.items.levels",
                lights:        "checklist.items.lights",
                cleanliness:   "checklist.items.cleanliness",
                documents:     "checklist.items.documents",
              };
              return {
                key: k,
                header: t(itemKey[k]),
                cell: (r: typeof checklists[number]) => <Icon name={r[k] === "OK" ? "check" : "close"} size={16} className={r[k] === "OK" ? "text-success-500" : "text-danger-500"} />,
                align: "center" as const,
              };
            }),
            { key: "st", header: t("common.status"), cell: (r) => {
              const ok = [r.bodyCondition, r.tires, r.levels, r.lights, r.cleanliness, r.documents].every((x) => x === "OK");
              return <Badge tone={ok ? "success" : "warning"}>{ok ? t("checklist.conform") : t("checklist.toCheck")}</Badge>;
            }},
          ]}
        />
      </Card>
    </div>
  );
}
