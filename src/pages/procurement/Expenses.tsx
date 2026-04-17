import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { FormField } from "../../components/ui/FormField";
import { StatCard } from "../../components/ui/StatCard";
import { Icon } from "../../components/layout/Icon";
import { expenses, suppliers } from "../../lib/mock-data";
import { formatCurrency, formatDate } from "../../lib/utils";
import { toast } from "sonner";
import type { PaymentStatus } from "../../types";

const STATUS_TONE: Record<PaymentStatus, "success" | "warning" | "info"> = {
  PAID:    "success",
  PENDING: "warning",
  PARTIAL: "info",
};

const CATEGORIES  = ["Pièces auto", "Mécanique", "Carburant", "Fournitures bureau", "Informatique", "Impression", "Autre"];
const DEPARTMENTS = ["Flotte", "Admin", "IT", "Marketing", "Finance", "RH"];

export default function Expenses() {
  const { t } = useTranslation();
  const [deptFilter, setDeptFilter] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [payFilter, setPayFilter] = useState<PaymentStatus | "">("");
  const [open, setOpen] = useState(false);

  const rows = useMemo(() => expenses.filter((e) => {
    if (deptFilter && e.department !== deptFilter) return false;
    if (catFilter && e.category !== catFilter) return false;
    if (payFilter && e.paymentStatus !== payFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date)), [deptFilter, catFilter, payFilter]);

  const totalAmount  = rows.reduce((s, e) => s + e.amount, 0);
  const totalPaid    = rows.filter((e) => e.paymentStatus === "PAID").reduce((s, e) => s + e.amount, 0);
  const totalPending = rows.filter((e) => e.paymentStatus !== "PAID").reduce((s, e) => s + e.amount, 0);

  const handleCreate = () => {
    setOpen(false);
    toast.success(t("procurement.expense.created"));
  };

  return (
    <div>
      <PageHeader
        title={t("procurement.expense.title")}
        subtitle={`${rows.length} dépense(s)`}
        actions={
          <Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>
            {t("procurement.expense.new")}
          </Button>
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mb-6">
        <StatCard label="Total" value={formatCurrency(totalAmount)} icon={<Icon name="money" size={22} />} />
        <StatCard label="Payé"  value={formatCurrency(totalPaid)}    icon={<Icon name="check" size={22} />} />
        <StatCard label="En attente" value={formatCurrency(totalPending)} icon={<Icon name="clock" size={22} />} />
      </div>

      <Card>
        <CardHeader title={t("common.filter")} />
        <div className="flex flex-wrap gap-3">
          <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="">{t("procurement.expense.fields.department")} · {t("common.all")}</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </Select>
          <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="">{t("procurement.expense.fields.category")} · {t("common.all")}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={payFilter} onChange={(e) => setPayFilter(e.target.value as PaymentStatus | "")}>
            <option value="">{t("procurement.expense.fields.paymentStatus")} · {t("common.all")}</option>
            <option value="PAID">{t("procurement.expense.paymentStatus.PAID")}</option>
            <option value="PENDING">{t("procurement.expense.paymentStatus.PENDING")}</option>
            <option value="PARTIAL">{t("procurement.expense.paymentStatus.PARTIAL")}</option>
          </Select>
          {(deptFilter || catFilter || payFilter) && (
            <Button variant="ghost" size="sm" onClick={() => { setDeptFilter(""); setCatFilter(""); setPayFilter(""); }}>
              <Icon name="close" size={14} /> Réinitialiser
            </Button>
          )}
        </div>
      </Card>

      <div className="mt-4">
        <Card padded={false}>
          <Table
            rowKey={(r) => r.id}
            rows={rows}
            columns={[
              { key: "date",    header: t("procurement.expense.fields.date"),     cell: (r) => formatDate(r.date) },
              { key: "sup",     header: t("procurement.expense.fields.supplier"), cell: (r) => (
                <span className="font-medium text-ink">{r.supplierName}</span>
              )},
              { key: "cat",     header: t("procurement.expense.fields.category"), cell: (r) => r.category },
              { key: "dept",    header: t("procurement.expense.fields.department"), cell: (r) => r.department },
              { key: "amount",  header: t("procurement.expense.fields.amount"),   cell: (r) => (
                <span className="tabular-nums font-medium">{formatCurrency(r.amount)}</span>
              ), align: "right" },
              { key: "payment", header: t("procurement.expense.fields.paymentStatus"), cell: (r) => (
                <Badge tone={STATUS_TONE[r.paymentStatus]}>{t(`procurement.expense.paymentStatus.${r.paymentStatus}`)}</Badge>
              )},
            ]}
          />
        </Card>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("procurement.expense.new")}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreate}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("procurement.expense.fields.supplier")} required className="sm:col-span-2">
            <Select required>
              <option value="">—</option>
              {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </FormField>
          <FormField label={t("procurement.expense.fields.amount")} required>
            <Input type="number" min={0} required placeholder="0" />
          </FormField>
          <FormField label={t("procurement.expense.fields.date")} required>
            <Input type="date" required />
          </FormField>
          <FormField label={t("procurement.expense.fields.category")} required>
            <Select required>
              <option value="">—</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </FormField>
          <FormField label={t("procurement.expense.fields.department")} required>
            <Select required>
              <option value="">—</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </Select>
          </FormField>
          <FormField label={t("procurement.expense.fields.paymentStatus")} required className="sm:col-span-2">
            <Select required defaultValue="PENDING">
              <option value="PENDING">{t("procurement.expense.paymentStatus.PENDING")}</option>
              <option value="PAID">{t("procurement.expense.paymentStatus.PAID")}</option>
              <option value="PARTIAL">{t("procurement.expense.paymentStatus.PARTIAL")}</option>
            </Select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
