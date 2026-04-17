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
import { Icon } from "../../components/layout/Icon";
import { suppliers } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import { toast } from "sonner";
import type { FiscalStatus, Supplier, SupplierStatus } from "../../types";

const SUPPLIER_STATUS_TONE: Record<SupplierStatus, "success" | "danger"> = {
  ACTIVE:   "success",
  TO_AVOID: "danger",
};

const FISCAL_STATUS_TONE: Record<FiscalStatus, "success" | "danger" | "warning" | "neutral"> = {
  COMPLIANT:     "success",
  NON_COMPLIANT: "danger",
  PENDING:       "warning",
  UNKNOWN:       "neutral",
};

const FISCAL_STATUS_ICON: Record<FiscalStatus, string> = {
  COMPLIANT:     "check",
  NON_COMPLIANT: "close",
  PENDING:       "clock",
  UNKNOWN:       "help",
};

const CATEGORIES = ["Pièces auto", "Mécanique", "Carburant", "Fournitures bureau", "Informatique", "Impression", "Autre"];
const CITIES     = ["Yaoundé", "Douala", "Bafoussam", "Garoua", "Autre"];

function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function FiscalBadge({ status, expiry, t }: { status: FiscalStatus; expiry?: string; t: (k: string) => string }) {
  const days = expiry ? daysUntil(expiry) : null;
  const isExpired  = days !== null && days < 0;
  const isExpiring = days !== null && days >= 0 && days <= 60;

  if (isExpired) {
    return <Badge tone="danger"><span className="flex items-center gap-1"><Icon name="alert" size={11} />{t("procurement.supplier.fiscal.expiredWarning")}</span></Badge>;
  }
  if (isExpiring) {
    return <Badge tone="warning"><span className="flex items-center gap-1"><Icon name="clock" size={11} />{t("procurement.supplier.fiscal.expiringWarning")} ({days}j)</span></Badge>;
  }
  return (
    <Badge tone={FISCAL_STATUS_TONE[status]}>
      <span className="flex items-center gap-1">
        <Icon name={FISCAL_STATUS_ICON[status]} size={11} />
        {t(`procurement.supplier.fiscal.status.${status}`)}
      </span>
    </Badge>
  );
}

function ComplianceRow({ label, status, t }: { label: string; status: FiscalStatus; t: (k: string) => string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border-soft last:border-0">
      <span className="text-[13px] text-muted">{label}</span>
      <Badge tone={FISCAL_STATUS_TONE[status]}>
        <span className="flex items-center gap-1">
          <Icon name={FISCAL_STATUS_ICON[status]} size={11} />
          {t(`procurement.supplier.fiscal.status.${status}`)}
        </span>
      </Badge>
    </div>
  );
}

export default function Suppliers() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<SupplierStatus | "">("");
  const [fiscalFilter, setFiscalFilter] = useState<FiscalStatus | "">("");
  const [createOpen, setCreateOpen] = useState(false);
  const [detailSupplier, setDetailSupplier] = useState<Supplier | null>(null);



  const rows = useMemo(() => suppliers.filter((s) => {
    if (catFilter && s.category !== catFilter) return false;
    if (statusFilter && s.status !== statusFilter) return false;
    if (fiscalFilter && s.fiscalStatus !== fiscalFilter) return false;
    if (q) {
      const term = q.toLowerCase();
      return s.name.toLowerCase().includes(term) || s.city.toLowerCase().includes(term) || (s.nui ?? "").toLowerCase().includes(term);
    }
    return true;
  }), [q, catFilter, statusFilter, fiscalFilter]);

  const nonCompliantCount = suppliers.filter(
    (s) => s.fiscalStatus === "NON_COMPLIANT" || (s.fiscalAttestationExpiry && daysUntil(s.fiscalAttestationExpiry) < 0)
  ).length;

  const expiringCount = suppliers.filter(
    (s) => s.fiscalAttestationExpiry && daysUntil(s.fiscalAttestationExpiry) >= 0 && daysUntil(s.fiscalAttestationExpiry) <= 60
  ).length;

  const handleCreate = () => {
    setCreateOpen(false);
    toast.success(t("procurement.supplier.created"));
  };

  return (
    <div>
      <PageHeader
        title={t("procurement.supplier.title")}
        subtitle={`${rows.length} fournisseur(s)`}
        actions={
          <Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setCreateOpen(true)}>
            {t("procurement.supplier.new")}
          </Button>
        }
      />

      {(nonCompliantCount > 0 || expiringCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-4">
          {nonCompliantCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
              <Icon name="alertCircle" size={15} />
              <span><strong>{nonCompliantCount}</strong> fournisseur(s) avec attestation expirée ou non conforme</span>
            </div>
          )}
          {expiringCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[13px] text-amber-700">
              <Icon name="clock" size={15} />
              <span><strong>{expiringCount}</strong> attestation(s) expirant dans les 60 jours</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("common.search") as string}
          leftIcon={<Icon name="search" size={16} />}
          className="w-60"
        />
        <Select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="">{t("procurement.supplier.fields.category")} · {t("common.all")}</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SupplierStatus | "")}>
          <option value="">{t("common.status")} · {t("common.all")}</option>
          <option value="ACTIVE">{t("procurement.supplier.status.ACTIVE")}</option>
          <option value="TO_AVOID">{t("procurement.supplier.status.TO_AVOID")}</option>
        </Select>
        <Select value={fiscalFilter} onChange={(e) => setFiscalFilter(e.target.value as FiscalStatus | "")}>
          <option value="">{t("procurement.supplier.fiscal.fiscalStatus")} · {t("common.all")}</option>
          <option value="COMPLIANT">{t("procurement.supplier.fiscal.status.COMPLIANT")}</option>
          <option value="NON_COMPLIANT">{t("procurement.supplier.fiscal.status.NON_COMPLIANT")}</option>
          <option value="PENDING">{t("procurement.supplier.fiscal.status.PENDING")}</option>
          <option value="UNKNOWN">{t("procurement.supplier.fiscal.status.UNKNOWN")}</option>
        </Select>
      </div>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          onRowClick={(r) => setDetailSupplier(r)}
          columns={[
            { key: "name", header: t("procurement.supplier.fields.name"), cell: (r) => (
              <div>
                <p className="font-medium text-ink">{r.name}</p>
                {r.nui && <p className="text-[11px] text-muted font-mono">{r.nui}</p>}
              </div>
            )},
            { key: "cat",     header: t("procurement.supplier.fields.category"), cell: (r) => r.category },
            { key: "city",    header: t("procurement.supplier.fields.city"),     cell: (r) => r.city },
            { key: "status",  header: t("common.status"), cell: (r) => (
              <Badge tone={SUPPLIER_STATUS_TONE[r.status]}>{t(`procurement.supplier.status.${r.status}`)}</Badge>
            )},
            { key: "fiscal",  header: t("procurement.supplier.fiscal.fiscalStatus"), cell: (r) => (
              <FiscalBadge status={r.fiscalStatus} expiry={r.fiscalAttestationExpiry} t={t} />
            )},
            { key: "cnps",    header: t("procurement.supplier.fiscal.cnpsStatus"), cell: (r) => (
              <Badge tone={FISCAL_STATUS_TONE[r.cnpsStatus]}>
                <span className="flex items-center gap-1">
                  <Icon name={FISCAL_STATUS_ICON[r.cnpsStatus]} size={11} />
                  {t(`procurement.supplier.fiscal.status.${r.cnpsStatus}`)}
                </span>
              </Badge>
            )},
            { key: "expiry",  header: t("procurement.supplier.fiscal.fiscalAttestationExpiry"), cell: (r) => {
              if (!r.fiscalAttestationExpiry) return <span className="text-muted">—</span>;
              const days = daysUntil(r.fiscalAttestationExpiry);
              return (
                <span className={days < 0 ? "text-red-600 font-medium" : days <= 60 ? "text-amber-600 font-medium" : ""}>
                  {formatDate(r.fiscalAttestationExpiry)}
                </span>
              );
            }},
          ]}
        />
      </Card>

      {/* Detail / compliance modal */}
      <Modal
        open={!!detailSupplier}
        onClose={() => setDetailSupplier(null)}
        title={detailSupplier?.name ?? ""}
        size="md"
        footer={<Button onClick={() => setDetailSupplier(null)}>{t("common.close")}</Button>}
      >
        {detailSupplier && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <p className="text-muted text-[11px] uppercase tracking-wide mb-0.5">{t("procurement.supplier.fields.category")}</p>
                <p className="font-medium">{detailSupplier.category}</p>
              </div>
              <div>
                <p className="text-muted text-[11px] uppercase tracking-wide mb-0.5">{t("procurement.supplier.fields.city")}</p>
                <p className="font-medium">{detailSupplier.city}</p>
              </div>
              <div>
                <p className="text-muted text-[11px] uppercase tracking-wide mb-0.5">{t("procurement.supplier.fields.contact")}</p>
                <p className="font-medium">{detailSupplier.contact}</p>
              </div>
              <div>
                <p className="text-muted text-[11px] uppercase tracking-wide mb-0.5">{t("common.status")}</p>
                <Badge tone={SUPPLIER_STATUS_TONE[detailSupplier.status]}>{t(`procurement.supplier.status.${detailSupplier.status}`)}</Badge>
              </div>
            </div>

            <div>
              <CardHeader title={t("procurement.supplier.fiscal.title")} />
              <div className="mt-2 space-y-0">
                {detailSupplier.nui && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border-soft">
                    <span className="text-[13px] text-muted">{t("procurement.supplier.fiscal.nui")}</span>
                    <span className="font-mono text-[13px] font-medium">{detailSupplier.nui}</span>
                  </div>
                )}
                {detailSupplier.rccm && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border-soft">
                    <span className="text-[13px] text-muted">{t("procurement.supplier.fiscal.rccm")}</span>
                    <span className="font-mono text-[13px] font-medium">{detailSupplier.rccm}</span>
                  </div>
                )}
                <ComplianceRow label={t("procurement.supplier.fiscal.fiscalStatus")} status={detailSupplier.fiscalStatus} t={t} />
                {detailSupplier.fiscalAttestationExpiry && (
                  <div className="flex items-center justify-between py-2.5 border-b border-border-soft">
                    <span className="text-[13px] text-muted">{t("procurement.supplier.fiscal.fiscalAttestationExpiry")}</span>
                    <span className={`text-[13px] font-medium ${
                      daysUntil(detailSupplier.fiscalAttestationExpiry) < 0 ? "text-red-600" :
                      daysUntil(detailSupplier.fiscalAttestationExpiry) <= 60 ? "text-amber-600" : ""
                    }`}>
                      {formatDate(detailSupplier.fiscalAttestationExpiry)}
                      {daysUntil(detailSupplier.fiscalAttestationExpiry) < 0 && " · Expirée"}
                      {daysUntil(detailSupplier.fiscalAttestationExpiry) >= 0 && daysUntil(detailSupplier.fiscalAttestationExpiry) <= 60 &&
                        ` · ${daysUntil(detailSupplier.fiscalAttestationExpiry)}j restants`}
                    </span>
                  </div>
                )}
                <ComplianceRow label={t("procurement.supplier.fiscal.cnpsStatus")} status={detailSupplier.cnpsStatus} t={t} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t("procurement.supplier.new")}
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleCreate}>{t("common.save")}</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("procurement.supplier.fields.name")} required className="sm:col-span-2">
              <Input required placeholder="Nom du fournisseur" />
            </FormField>
            <FormField label={t("procurement.supplier.fields.category")} required>
              <Select required>
                <option value="">—</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label={t("procurement.supplier.fields.city")} required>
              <Select required>
                <option value="">—</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label={t("procurement.supplier.fields.contact")} required className="sm:col-span-2">
              <Input required placeholder="+237 6XX XX XX XX" leftIcon={<Icon name="phone" size={15} />} />
            </FormField>
            <FormField label={t("procurement.supplier.fields.status")} required className="sm:col-span-2">
              <Select required defaultValue="ACTIVE">
                <option value="ACTIVE">{t("procurement.supplier.status.ACTIVE")}</option>
                <option value="TO_AVOID">{t("procurement.supplier.status.TO_AVOID")}</option>
              </Select>
            </FormField>
          </div>

          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted mb-3">
              {t("procurement.supplier.fiscal.title")}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label={t("procurement.supplier.fiscal.nui")}>
                <Input placeholder="M0XXXXXXXXXXX" className="font-mono" />
              </FormField>
              <FormField label={t("procurement.supplier.fiscal.rccm")}>
                <Input placeholder="RC/YAO/XXXX/B/XXXX" className="font-mono" />
              </FormField>
              <FormField label={t("procurement.supplier.fiscal.fiscalStatus")} required>
                <Select required defaultValue="UNKNOWN">
                  <option value="COMPLIANT">{t("procurement.supplier.fiscal.status.COMPLIANT")}</option>
                  <option value="NON_COMPLIANT">{t("procurement.supplier.fiscal.status.NON_COMPLIANT")}</option>
                  <option value="PENDING">{t("procurement.supplier.fiscal.status.PENDING")}</option>
                  <option value="UNKNOWN">{t("procurement.supplier.fiscal.status.UNKNOWN")}</option>
                </Select>
              </FormField>
              <FormField label={t("procurement.supplier.fiscal.fiscalAttestationExpiry")}>
                <Input type="date" />
              </FormField>
              <FormField label={t("procurement.supplier.fiscal.cnpsStatus")} required className="sm:col-span-2">
                <Select required defaultValue="UNKNOWN">
                  <option value="COMPLIANT">{t("procurement.supplier.fiscal.status.COMPLIANT")}</option>
                  <option value="NON_COMPLIANT">{t("procurement.supplier.fiscal.status.NON_COMPLIANT")}</option>
                  <option value="PENDING">{t("procurement.supplier.fiscal.status.PENDING")}</option>
                  <option value="UNKNOWN">{t("procurement.supplier.fiscal.status.UNKNOWN")}</option>
                </Select>
              </FormField>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
