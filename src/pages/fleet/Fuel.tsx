import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Icon } from "../../components/layout/Icon";
import { BarChart } from "../../components/charts/BarChart";
import { fuelByVehicleSeries, fuelEntries, vehicles } from "../../lib/mock-data";
import { formatCurrency, formatDate } from "../../lib/utils";
import { StatCard } from "../../components/ui/StatCard";
import { toast } from "sonner";

export default function Fuel() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [veh, setVeh] = useState("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => fuelEntries.filter((f) => {
    if (veh && f.vehicleId !== veh) return false;
    if (q) {
      const s = q.toLowerCase();
      const plate = vehicles.find((v) => v.id === f.vehicleId)?.plate?.toLowerCase() ?? "";
      return plate.includes(s) || (f.station ?? "").toLowerCase().includes(s);
    }
    return true;
  }), [q, veh]);

  const totalL = rows.reduce((s, f) => s + f.liters, 0);
  const totalA = rows.reduce((s, f) => s + f.amount, 0);

  return (
    <div>
      <PageHeader
        title={t("fuel.title")}
        subtitle={`${rows.length} plein(s)`}
        actions={<Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>{t("fuel.new")}</Button>}
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label={t("dashboard.kpi.fuelSpend")} value={formatCurrency(totalA)} icon={<Icon name="fuel" size={22} />} />
        <StatCard label="Litres"                       value={`${totalL} L`} icon={<Icon name="fuel" size={22} />} />
        <StatCard label="Pleins"                       value={rows.length}   icon={<Icon name="clipboard" size={22} />} />
        <StatCard label="Véhicules actifs"             value={vehicles.length} icon={<Icon name="car" size={22} />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title={t("dashboard.charts.fuelByVehicle")} />
          <BarChart data={fuelByVehicleSeries()} horizontal />
        </Card>
        <Card>
          <CardHeader title="Filtres" />
          <div className="space-y-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search") as string} leftIcon={<Icon name="search" size={16} />} />
            <Select value={veh} onChange={(e) => setVeh(e.target.value)}>
              <option value="">{t("vehicle.title")} · {t("common.all")}</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
            </Select>
            <Button variant="outline" fullWidth leftIcon={<Icon name="download" size={16} />}>{t("common.export")}</Button>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "d",  header: t("fuel.fields.date"),     cell: (r) => formatDate(r.date) },
            { key: "v",  header: t("fuel.fields.vehicle"),  cell: (r) => vehicles.find((v) => v.id === r.vehicleId)?.plate ?? "—" },
            { key: "l",  header: t("fuel.fields.liters"),   cell: (r) => <span className="tabular-nums">{r.liters} L</span>, align: "right" },
            { key: "a",  header: t("fuel.fields.amount"),   cell: (r) => <span className="tabular-nums">{formatCurrency(r.amount)}</span>, align: "right" },
            { key: "km", header: t("fuel.fields.km"),       cell: (r) => <span className="tabular-nums">{r.kmReading.toLocaleString()}</span>, align: "right" },
            { key: "ft", header: t("fuel.fields.fuelType"), cell: (r) => r.fuelType },
            { key: "st", header: t("fuel.fields.station"),  cell: (r) => r.station ?? "—" },
          ]}
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("fuel.new")}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setOpen(false); toast.success("Plein enregistré"); }}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("fuel.fields.date")} required><Input type="date" required /></FormField>
          <FormField label={t("fuel.fields.vehicle")} required>
            <Select required>
              <option value="">—</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
            </Select>
          </FormField>
          <FormField label={t("fuel.fields.liters")} required><Input type="number" step="0.1" min={0} required /></FormField>
          <FormField label={t("fuel.fields.amount")} required><Input type="number" min={0} required /></FormField>
          <FormField label={t("fuel.fields.km")} required><Input type="number" min={0} required /></FormField>
          <FormField label={t("fuel.fields.fuelType")} required>
            <Select required defaultValue="DIESEL">
              <option value="DIESEL">Diesel</option>
              <option value="GASOLINE">Essence</option>
              <option value="HYBRID">Hybride</option>
            </Select>
          </FormField>
          <FormField label={t("fuel.fields.station")} className="sm:col-span-2"><Input /></FormField>
        </div>
      </Modal>
    </div>
  );
}
