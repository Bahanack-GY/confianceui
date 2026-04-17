import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { FormField } from "../../components/ui/FormField";
import { Icon } from "../../components/layout/Icon";
import { purchaseRequests, suppliers } from "../../lib/mock-data";
import { formatCurrency, formatDate } from "../../lib/utils";
import { toast } from "sonner";
import type { RequestStatus } from "../../types";

const STATUS_TONE: Record<RequestStatus, "warning" | "success" | "danger"> = {
  PENDING:  "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

const STEPS = ["info", "details", "document"] as const;

const DEPARTMENTS = ["Flotte", "Admin", "IT", "Marketing", "Finance", "RH"];
const CATEGORIES  = ["Pièces auto", "Mécanique", "Carburant", "Fournitures bureau", "Informatique", "Impression", "Autre"];

export default function Requests() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "">("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => purchaseRequests.filter((r) => {
    if (statusFilter && r.status !== statusFilter) return false;
    if (q) {
      const s = q.toLowerCase();
      return r.description.toLowerCase().includes(s) || r.requester.toLowerCase().includes(s) || r.category.toLowerCase().includes(s);
    }
    return true;
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [q, statusFilter]);

  const handleCreate = () => {
    if (step < STEPS.length - 1) { setStep(step + 1); return; }
    setOpen(false);
    setStep(0);
    toast.success(t("procurement.request.created"));
  };

  const handleValidate = (id: string) => {
    setSelectedId(id);
    toast.success(t("procurement.request.validated"));
  };

  const handleReject = () => {
    setRejectOpen(false);
    setSelectedId(null);
    toast.success(t("procurement.request.rejected"));
  };

  return (
    <div>
      <PageHeader
        title={t("procurement.request.title")}
        subtitle={`${rows.length} demande(s)`}
        actions={
          <Button leftIcon={<Icon name="plus" size={16} />} onClick={() => { setOpen(true); setStep(0); }}>
            {t("procurement.request.new")}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("common.search") as string}
          leftIcon={<Icon name="search" size={16} />}
          className="w-60"
        />
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as RequestStatus | "")}>
          <option value="">{t("common.status")} · {t("common.all")}</option>
          <option value="PENDING">{t("procurement.request.status.PENDING")}</option>
          <option value="APPROVED">{t("procurement.request.status.APPROVED")}</option>
          <option value="REJECTED">{t("procurement.request.status.REJECTED")}</option>
        </Select>
      </div>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "date",   header: t("common.date"),                    cell: (r) => formatDate(r.createdAt) },
            { key: "req",    header: t("procurement.request.fields.requester"), cell: (r) => r.requester },
            { key: "dept",   header: t("procurement.request.fields.department"), cell: (r) => r.department },
            { key: "type",   header: t("procurement.request.fields.type"),  cell: (r) => (
              <Badge tone="neutral">{t(`procurement.request.type.${r.type}`)}</Badge>
            )},
            { key: "cat",    header: t("procurement.request.fields.category"), cell: (r) => r.category },
            { key: "desc",   header: t("procurement.request.fields.description"), cell: (r) => (
              <span className="line-clamp-1 max-w-[200px]">{r.description}</span>
            )},
            { key: "amount", header: t("procurement.request.fields.estimatedAmount"), cell: (r) => (
              <span className="tabular-nums">{formatCurrency(r.estimatedAmount)}</span>
            ), align: "right" },
            { key: "status", header: t("common.status"), cell: (r) => (
              <Badge tone={STATUS_TONE[r.status]}>{t(`procurement.request.status.${r.status}`)}</Badge>
            )},
            { key: "actions", header: "", cell: (r) => r.status === "PENDING" ? (
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleValidate(r.id)}>
                  <Icon name="check" size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { setSelectedId(r.id); setRejectOpen(true); }}>
                  <Icon name="close" size={14} />
                </Button>
              </div>
            ) : null },
          ]}
        />
      </Card>

      {/* Create modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("procurement.request.new")}
        size="lg"
        footer={
          <>
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>{t("common.previous")}</Button>
            )}
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreate}>
              {step < STEPS.length - 1 ? t("common.next") : t("common.save")}
            </Button>
          </>
        }
      >
        <div className="mb-5 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-bold transition-base ${
                i <= step ? "bg-brand-500 text-white" : "bg-border-soft text-muted"
              }`}>{i + 1}</span>
              <span className={`text-[12px] font-medium ${i === step ? "text-ink" : "text-muted"}`}>
                {t(`procurement.request.steps.${s}`)}
              </span>
              {i < STEPS.length - 1 && <span className="text-border-soft mx-1">—</span>}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("procurement.request.fields.requester")} required>
              <Input required placeholder="Nom complet" />
            </FormField>
            <FormField label={t("procurement.request.fields.department")} required>
              <Select required>
                <option value="">—</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </FormField>
            <FormField label={t("procurement.request.fields.type")} required>
              <Select required>
                <option value="">—</option>
                <option value="purchase">{t("procurement.request.type.purchase")}</option>
                <option value="service">{t("procurement.request.type.service")}</option>
              </Select>
            </FormField>
            <FormField label={t("procurement.request.fields.category")} required>
              <Select required>
                <option value="">—</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <FormField label={t("procurement.request.fields.description")} required>
              <Textarea required rows={3} placeholder="Décrire le besoin en détail..." />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("procurement.request.fields.estimatedAmount")} required>
                <Input type="number" min={0} required placeholder="0" />
              </FormField>
              <FormField label={t("procurement.request.fields.suggestedSupplier")}>
                <Select>
                  <option value="">—</option>
                  {suppliers.filter((s) => s.status === "ACTIVE").map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4">
            <FormField label={t("procurement.request.fields.attachments")}>
              <div className="border-2 border-dashed border-[color:var(--color-border-soft)] rounded-lg p-8 text-center">
                <Icon name="upload" size={28} className="mx-auto mb-2 text-muted" />
                <p className="text-[13px] text-muted">Glisser-déposer ou cliquer pour sélectionner</p>
                <p className="text-[11px] text-muted mt-1">JPG, PNG, PDF · max 5 Mo</p>
                <Button variant="outline" size="sm" className="mt-3">Parcourir</Button>
              </div>
            </FormField>
          </div>
        )}
      </Modal>

      {/* Reject modal */}
      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title={t("procurement.request.reject")}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>{t("common.cancel")}</Button>
            <Button variant="danger" onClick={handleReject}>{t("procurement.request.reject")}</Button>
          </>
        }
      >
        <FormField label={t("procurement.request.fields.validationNote")}>
          <Textarea rows={3} placeholder="Motif du rejet..." />
        </FormField>
      </Modal>
    </div>
  );
}
