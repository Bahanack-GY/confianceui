import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { shiftReports } from "../../lib/mock-data";
import { formatDate, percent } from "../../lib/utils";

interface Props { newPath: string; }

export default function ShiftReportsList({ newPath }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <PageHeader
        title={t("shiftReport.title")}
        subtitle={`${shiftReports.length} rapport(s)`}
        actions={
          <Link to={newPath}>
            <Button leftIcon={<Icon name="plus" size={16} />}>{t("shiftReport.new")}</Button>
          </Link>
        }
      />

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={shiftReports}
          columns={[
            { key: "date",  header: t("common.date"),          cell: (r) => <span className="font-medium text-ink">{formatDate(r.date)}</span> },
            { key: "shift", header: t("shift.concerned"),      cell: (r) => <Badge tone="brand">{t(`shift.${r.shiftSlot}`)}</Badge> },
            { key: "sup",   header: "Superviseur",             cell: (r) => r.supervisorName ?? "—" },
            { key: "trips", header: t("dashboard.kpi.totalTrips"),   cell: (r) => <span className="tabular-nums">{r.totalTrips}</span>, align: "right" },
            { key: "sr",    header: t("dashboard.kpi.successRate"),  cell: (r) => <span className="tabular-nums text-success-500">{percent(r.successRate, 0)}</span>, align: "right" },
            { key: "cr",    header: t("dashboard.kpi.cancelRate"),   cell: (r) => <span className="tabular-nums text-warning-500">{percent(r.cancelRate, 0)}</span>, align: "right" },
            { key: "act",   header: "", align: "right",        cell: () => <Button size="sm" variant="ghost" rightIcon={<Icon name="right" size={14} />}>{t("common.view")}</Button> },
          ]}
          empty="Aucun rapport"
        />
      </Card>
    </div>
  );
}
