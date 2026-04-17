import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Textarea } from "../../components/ui/Textarea";
import { Icon } from "../../components/layout/Icon";
import { serviceTrackings } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import { toast } from "sonner";
import type { ServiceStatus } from "../../types";

const STATUS_TONE: Record<ServiceStatus, "warning" | "info" | "success"> = {
  PENDING:     "warning",
  IN_PROGRESS: "info",
  DONE:        "success",
};

const STATUS_ICON: Record<ServiceStatus, string> = {
  PENDING:     "clock",
  IN_PROGRESS: "workflow",
  DONE:        "check",
};

export default function Services() {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "">("");
  const [proofOpen, setProofOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => serviceTrackings.filter((s) => {
    if (statusFilter && s.status !== statusFilter) return false;
    return true;
  }), [statusFilter]);

  const handleStatusUpdate = () => {
    setUpdateOpen(false);
    setSelectedId(null);
    toast.success(t("procurement.service.updated"));
  };

  return (
    <div>
      <PageHeader
        title={t("procurement.service.title")}
        subtitle={`${rows.length} prestation(s)`}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ServiceStatus | "")}>
          <option value="">{t("common.status")} · {t("common.all")}</option>
          <option value="PENDING">{t("procurement.service.status.PENDING")}</option>
          <option value="IN_PROGRESS">{t("procurement.service.status.IN_PROGRESS")}</option>
          <option value="DONE">{t("procurement.service.status.DONE")}</option>
        </Select>
      </div>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "supplier", header: t("procurement.service.fields.supplier"), cell: (r) => (
              <span className="font-medium text-ink">{r.supplierName}</span>
            )},
            { key: "desc",     header: t("procurement.service.fields.description"), cell: (r) => (
              <span className="line-clamp-1 max-w-[240px]">{r.description}</span>
            )},
            { key: "status",   header: t("common.status"), cell: (r) => (
              <Badge tone={STATUS_TONE[r.status]}>
                <span className="flex items-center gap-1.5">
                  <Icon name={STATUS_ICON[r.status]} size={12} />
                  {t(`procurement.service.status.${r.status}`)}
                </span>
              </Badge>
            )},
            { key: "start",    header: t("procurement.service.fields.startDate"), cell: (r) => r.startDate ? formatDate(r.startDate) : "—" },
            { key: "end",      header: t("procurement.service.fields.endDate"),   cell: (r) => r.endDate   ? formatDate(r.endDate)   : "—" },
            { key: "actions",  header: "", cell: (r) => (
              <div className="flex gap-2">
                {r.status !== "DONE" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => { setSelectedId(r.id); setUpdateOpen(true); }}
                  >
                    <Icon name="edit" size={13} />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setSelectedId(r.id); setProofOpen(true); }}
                  title="Ajouter une preuve"
                >
                  <Icon name="upload" size={13} />
                </Button>
              </div>
            )},
          ]}
        />
      </Card>

      {/* Status update modal */}
      <Modal
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        title="Mettre à jour le statut"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleStatusUpdate}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="grid gap-4">
          <FormField label={t("procurement.service.fields.status")} required>
            <Select required>
              <option value="PENDING">{t("procurement.service.status.PENDING")}</option>
              <option value="IN_PROGRESS">{t("procurement.service.status.IN_PROGRESS")}</option>
              <option value="DONE">{t("procurement.service.status.DONE")}</option>
            </Select>
          </FormField>
          <FormField label="Commentaire">
            <Textarea rows={2} placeholder="Informations complémentaires..." />
          </FormField>
        </div>
      </Modal>

      {/* Proof upload modal */}
      <Modal
        open={proofOpen}
        onClose={() => setProofOpen(false)}
        title="Ajouter une preuve"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setProofOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setProofOpen(false); toast.success("Preuve ajoutée"); }}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="border-2 border-dashed border-border-soft rounded-lg p-8 text-center">
          <Icon name="upload" size={28} className="mx-auto mb-2 text-muted" />
          <p className="text-[13px] text-muted">Photo ou document de preuve</p>
          <p className="text-[11px] text-muted mt-1">JPG, PNG, PDF · max 5 Mo</p>
          <Button variant="outline" size="sm" className="mt-3">Parcourir</Button>
        </div>
      </Modal>
    </div>
  );
}
