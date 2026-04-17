import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/layout/Icon";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import { trips, drivers, vehicles } from "../../lib/mock-data";
import { formatDateTime, getPresetRange, inDateRange } from "../../lib/utils";
import type { TripStatus } from "../../types";
import type { DatePreset, DateRange } from "../../lib/utils";

const STATUS_TONE: Record<TripStatus, "neutral" | "brand" | "success" | "warning" | "danger" | "info"> = {
  PENDING: "neutral", ASSIGNED: "info", IN_PROGRESS: "brand",
  COMPLETED: "success", CANCELLED: "warning", REFUSED: "danger",
};

const DEFAULT_PRESET: DatePreset = "week";

export default function TripsList() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | TripStatus>("");
  const [preset, setPreset] = useState<DatePreset>(DEFAULT_PRESET);
  const [range, setRange] = useState<DateRange>(getPresetRange(DEFAULT_PRESET));

  const handleDateChange = (p: DatePreset, r: DateRange) => {
    setPreset(p);
    setRange(r);
  };

  const rows = useMemo(() => trips.filter((tr) => {
    if (status && tr.status !== status) return false;
    if (!inDateRange(tr.requestedAt, range)) return false;
    if (q) {
      const s = q.toLowerCase();
      return [tr.id, tr.clientName, tr.pickup, tr.dropoff].some((x) => x.toLowerCase().includes(s));
    }
    return true;
  }), [q, status, range]);

  return (
    <div>
      <PageHeader
        title={t("nav.trips")}
        subtitle={`${rows.length} course(s)`}
        actions={<Badge tone="brand">{t("common.liveUpdates")}</Badge>}
      />

      <Card className="mb-4">
        <div className="flex flex-col gap-3">
          <DateRangeFilter preset={preset} range={range} onChange={handleDateChange} />
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[220px]">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("common.search") as string}
                leftIcon={<Icon name="search" size={16} />}
              />
            </div>
            <div className="w-48">
              <Select value={status} onChange={(e) => setStatus(e.target.value as TripStatus)}>
                <option value="">{t("common.status")} · {t("common.all")}</option>
                {(["PENDING","ASSIGNED","IN_PROGRESS","COMPLETED","CANCELLED","REFUSED"] as TripStatus[]).map((s) => (
                  <option key={s} value={s}>{t(`trip.status.${s}`)}</option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "id",     header: "ID",    cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">{r.id}</span> },
            { key: "client", header: "Client",cell: (r) => <span className="font-medium text-ink">{r.clientName}</span> },
            { key: "trip",   header: "Trajet",cell: (r) => <span className="text-[13px]">{r.pickup} <span className="text-muted-soft">→</span> {r.dropoff}</span> },
            { key: "drv",    header: t("driver.title"),  cell: (r) => drivers.find((d) => d.id === r.driverId)?.name ?? "—" },
            { key: "vh",     header: t("vehicle.title"), cell: (r) => vehicles.find((v) => v.id === r.vehicleId)?.plate ?? "—" },
            { key: "at",     header: t("common.date"),   cell: (r) => formatDateTime(r.requestedAt) },
            { key: "st",     header: t("common.status"), cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{t(`trip.status.${r.status}`)}</Badge> },
          ]}
          empty={t("dateFilter.noResults") as string}
        />
      </Card>
    </div>
  );
}
