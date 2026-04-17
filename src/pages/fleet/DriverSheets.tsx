import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Textarea } from "../../components/ui/Textarea";
import { Icon } from "../../components/layout/Icon";
import { driverSheets, drivers, vehicles } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import { toast } from "sonner";

export default function DriverSheets() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [shift, setShift] = useState<"" | "MORNING" | "EVENING" | "NIGHT">("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => driverSheets.filter((s) => {
    if (shift && s.shiftSlot !== shift) return false;
    if (q) {
      const ss = q.toLowerCase();
      const drv = drivers.find((d) => d.id === s.driverId)?.name?.toLowerCase() ?? "";
      const vh  = vehicles.find((v) => v.id === s.vehicleId)?.plate?.toLowerCase() ?? "";
      return drv.includes(ss) || vh.includes(ss);
    }
    return true;
  }), [q, shift]);

  return (
    <div>
      <PageHeader
        title={t("driver.sheet")}
        subtitle={`${rows.length} fiche(s)`}
        actions={<Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>Nouvelle fiche</Button>}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search") as string} leftIcon={<Icon name="search" size={16} />} />
          </div>
          <div className="w-44">
            <Select value={shift} onChange={(e) => setShift(e.target.value as typeof shift)}>
              <option value="">{t("shift.slot")} · {t("common.all")}</option>
              <option value="MORNING">{t("shift.MORNING")}</option>
              <option value="EVENING">{t("shift.EVENING")}</option>
              <option value="NIGHT">{t("shift.NIGHT")}</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "date", header: t("common.date"),           cell: (r) => formatDate(r.date) },
            { key: "drv",  header: t("driver.fields.name"),    cell: (r) => drivers.find((d) => d.id === r.driverId)?.name ?? "—" },
            { key: "vh",   header: t("vehicle.fields.plate"),  cell: (r) => vehicles.find((v) => v.id === r.vehicleId)?.plate ?? "—" },
            { key: "sh",   header: t("shift.slot"),            cell: (r) => <Badge tone="brand">{t(`shift.${r.shiftSlot}`)}</Badge> },
            { key: "tr",   header: t("driver.fields.trips"),   cell: (r) => r.trips, align: "right" },
            { key: "ac",   header: t("driver.fields.accepted"),cell: (r) => r.accepted, align: "right" },
            { key: "inc",  header: t("driver.fields.incidents"),cell: (r) => r.incidents, align: "right" },
            { key: "rat",  header: "Qualité",                  cell: (r) => <span className="inline-flex items-center gap-1"><Icon name="star" size={14} className="text-warning-500" />{((r.punctuality + r.presentation + r.rulesCompliance) / 3).toFixed(1)}</span> },
          ]}
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("driver.sheet")}
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setOpen(false); toast.success("Fiche enregistrée"); }}>{t("common.submit")}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label={t("driver.fields.name")} required>
            <Select required>
              <option value="">—</option>
              {drivers.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </FormField>
          <FormField label={t("driver.fields.vehicleId")} required>
            <Select required>
              <option value="">—</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
            </Select>
          </FormField>
          <FormField label={t("shift.slot")} required>
            <Select required defaultValue="MORNING">
              <option value="MORNING">{t("shift.MORNING")}</option>
              <option value="EVENING">{t("shift.EVENING")}</option>
              <option value="NIGHT">{t("shift.NIGHT")}</option>
            </Select>
          </FormField>
          <FormField label={t("driver.fields.trips")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.accepted")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.refused")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.cancelled")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.loginAt")}><Input type="time" /></FormField>
          <FormField label={t("driver.fields.breakAt")}><Input type="time" /></FormField>
          <FormField label={t("driver.fields.logoutAt")}><Input type="time" /></FormField>
          <FormField label={t("driver.fields.refuelAt")}><Input type="time" /></FormField>
          <FormField label={t("driver.fields.punctuality")}><Select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></Select></FormField>
          <FormField label={t("driver.fields.presentation")}><Select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></Select></FormField>
          <FormField label={t("driver.fields.rulesCompliance")}><Select><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option></Select></FormField>
          <FormField label={t("driver.fields.lateCount")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.absences")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.incidents")}><Input type="number" min={0} /></FormField>
          <FormField label={t("driver.fields.clientFeedback")}   className="sm:col-span-3"><Textarea /></FormField>
          <FormField label={t("driver.fields.driverFeedback")}   className="sm:col-span-3"><Textarea /></FormField>
          <FormField label={t("driver.fields.supervisorComment")} className="sm:col-span-3"><Textarea /></FormField>
        </div>
      </Modal>
    </div>
  );
}
