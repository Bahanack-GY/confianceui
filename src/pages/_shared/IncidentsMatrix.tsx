import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/layout/Icon";
import { FormField } from "../../components/ui/FormField";
import { Textarea } from "../../components/ui/Textarea";
import { Section } from "../../components/ui/Section";
import { incidents, drivers, vehicles } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import type { Incident, IncidentType, IncidentStatus } from "../../types";
import { toast } from "sonner";
import { PhotoUpload } from "../../components/ui/PhotoUpload";

interface Props {
  title?: string;
  department?: "DISPATCH" | "FLEET";
  allowCreate?: boolean;
}

const TYPE_TONE: Record<IncidentType, "neutral" | "warning" | "danger" | "info" | "brand"> = {
  ACCIDENT: "danger", ACCIDENT_MINOR: "warning", THEFT: "danger", FIRE: "danger",
  SECURITY: "warning", BREAKDOWN: "info", CLIENT_CONFLICT: "warning",
  INAPPROPRIATE_BEHAVIOR: "warning", OTHER: "neutral",
};

const STATUS_TONE: Record<IncidentStatus, "neutral" | "warning" | "success"> = {
  OPEN: "warning", IN_PROGRESS: "warning", CLOSED: "success",
};

export default function IncidentsMatrix({ title, department, allowCreate = true }: Props) {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | IncidentStatus>("");
  const [type, setType] = useState<"" | IncidentType>("");
  const [open, setOpen] = useState(false);

  const rows = useMemo<Incident[]>(() => {
    return incidents.filter((i) => {
      if (department && i.department !== department) return false;
      if (status && i.status !== status) return false;
      if (type && i.type !== type) return false;
      if (q) {
        const s = q.toLowerCase();
        return [i.ref, i.plate, i.location, i.description].some((x) => x?.toLowerCase().includes(s));
      }
      return true;
    });
  }, [q, status, type, department]);

  return (
    <div>
      <PageHeader
        title={title ?? t("incident.matrix")}
        subtitle={`${rows.length} incident(s)`}
        actions={
          allowCreate ? (
            <Button leftIcon={<Icon name="plus" size={16} />} onClick={() => setOpen(true)}>{t("incident.new")}</Button>
          ) : null
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input placeholder={t("common.search") as string} value={q} onChange={(e) => setQ(e.target.value)} leftIcon={<Icon name="search" size={16} />} />
          </div>
          <div className="w-44">
            <Select value={status} onChange={(e) => setStatus(e.target.value as IncidentStatus)}>
              <option value="">{t("common.status")} · {t("common.all")}</option>
              <option value="OPEN">{t("incident.status.OPEN")}</option>
              <option value="IN_PROGRESS">{t("incident.status.IN_PROGRESS")}</option>
              <option value="CLOSED">{t("incident.status.CLOSED")}</option>
            </Select>
          </div>
          <div className="w-52">
            <Select value={type} onChange={(e) => setType(e.target.value as IncidentType)}>
              <option value="">{t("incident.fields.type")} · {t("common.all")}</option>
              {(["ACCIDENT","ACCIDENT_MINOR","THEFT","FIRE","SECURITY","BREAKDOWN","CLIENT_CONFLICT","INAPPROPRIATE_BEHAVIOR","OTHER"] as IncidentType[]).map((tt) => (
                <option key={tt} value={tt}>{t(`incident.type.${tt}`)}</option>
              ))}
            </Select>
          </div>
          <Button variant="outline" leftIcon={<Icon name="download" size={16} />}>{t("common.export")}</Button>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          columns={[
            { key: "ref",    header: "Réf ID",                cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">#{r.ref}</span> },
            { key: "date",   header: t("common.date"),        cell: (r) => <span>{formatDate(r.date)}<span className="text-muted ml-1">· {r.time}</span></span> },
            { key: "driver", header: t("incident.fields.driverName"), cell: (r) => drivers.find((d) => d.id === r.driverId)?.name ?? "—" },
            { key: "type",   header: t("incident.fields.type"),       cell: (r) => <Badge tone={TYPE_TONE[r.type]}>{t(`incident.type.${r.type}`)}</Badge> },
            { key: "desc",   header: "Description",           cell: (r) => <span className="text-[13px] text-ink-soft line-clamp-1 max-w-[280px] block">{r.description}</span> },
            { key: "plate",  header: t("incident.fields.plate"),   cell: (r) => <span className="font-mono text-[12.5px]">{r.plate ?? "—"}</span> },
            { key: "action", header: "Action prise",          cell: (r) => <span className="text-[13px] text-ink-soft line-clamp-1 max-w-[220px] block">{r.actionsTaken ?? "—"}</span> },
            { key: "status", header: t("common.status"),      cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{t(`incident.status.${r.status}`)}</Badge> },
          ]}
          empty="Aucun incident"
        />
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t("incident.new")}
        description={t("incident.title")}
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={() => { setOpen(false); toast.success("Incident enregistré"); }}>{t("common.submit")}</Button>
          </>
        }
      >
        <IncidentForm department={department ?? "DISPATCH"} />
      </Modal>
    </div>
  );
}

function IncidentForm({ department }: { department: "DISPATCH" | "FLEET" }) {
  const { t } = useTranslation();
  const isFleet = department === "FLEET";
  return (
    <div>
      <Section title={t("incident.sections.general")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label={t("incident.fields.reportedBy")} required><Input /></FormField>
          <FormField label={t("incident.fields.service")} required>
            <Select defaultValue={department}>
              <option value="DISPATCH">Dispatch</option>
              <option value="FLEET">Flotte</option>
            </Select>
          </FormField>
          <FormField label={t("incident.fields.email")}><Input type="email" /></FormField>
          {isFleet && <FormField label={t("incident.fields.driverName")} required><Input /></FormField>}
        </div>
      </Section>

      <Section title={t("incident.sections.details")}>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label={t("incident.fields.location")} required><Input leftIcon={<Icon name="location" size={14} />} /></FormField>
          <FormField label={t("common.date")} required><Input type="date" required /></FormField>
          <FormField label={t("common.time")} required><Input type="time" required /></FormField>
          <FormField label={t("incident.fields.tripId")}><Input placeholder="T-1000" /></FormField>
          <FormField label={t("incident.fields.vehicleId")}>
            <Select>
              <option value="">—</option>
              {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
            </Select>
          </FormField>
          <FormField label={t("incident.fields.plate")}><Input /></FormField>
          <FormField label={t("incident.fields.type")} className="sm:col-span-3" required>
            <div className="flex flex-wrap gap-2">
              {(["ACCIDENT","ACCIDENT_MINOR","THEFT","FIRE","SECURITY","BREAKDOWN","CLIENT_CONFLICT","INAPPROPRIATE_BEHAVIOR","OTHER"] as IncidentType[]).map((tt) => (
                <label key={tt} className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-white border border-border text-[13px] cursor-pointer transition-base hover:bg-surface-alt has-[input:checked]:bg-brand-500 has-[input:checked]:text-white has-[input:checked]:border-brand-500">
                  <input type="radio" name="type" value={tt} className="sr-only" />
                  {t(`incident.type.${tt}`)}
                </label>
              ))}
            </div>
          </FormField>
          <FormField label={t("incident.fields.description")} required className="sm:col-span-3">
            <Textarea rows={4} placeholder="Signalez tous les détails de l'incident..." />
          </FormField>
        </div>
      </Section>

      <Section title={t("incident.sections.damages")}>
        <FormField><Textarea placeholder="Décrire tous les dommages liés au véhicule / personnes" /></FormField>
      </Section>

      {isFleet && (
        <>
          <Section title={t("incident.sections.people")}>
            <FormField><Textarea placeholder="Personnes impliquées..." /></FormField>
          </Section>

          <Section title={t("incident.sections.consequences")}>
            <div className="flex flex-wrap gap-2">
              {(["NONE","DELAY","MATERIAL","COMPLAINT"] as const).map((c) => (
                <label key={c} className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-white border border-border text-[13px] cursor-pointer transition-base hover:bg-surface-alt has-[input:checked]:bg-brand-50 has-[input:checked]:text-brand-500 has-[input:checked]:border-brand-500">
                  <input type="checkbox" className="sr-only" />
                  {t(`incident.consequence.${c}`)}
                </label>
              ))}
            </div>
          </Section>
        </>
      )}

      <Section title={t("incident.photos.title")}>
        <PhotoUpload maxFiles={5} />
      </Section>

      <Section title={t("incident.sections.actions")}>
        <FormField><Textarea placeholder="Décrire toutes les mesures correctives déjà prises ou à prendre" /></FormField>
      </Section>

      {isFleet && (
        <Section title={t("incident.fields.supervisorRecommendation")}>
          <Select defaultValue="NONE">
            {(["NONE","WARNING","SUSPENSION","OTHER"] as const).map((r) => (
              <option key={r} value={r}>{t(`incident.recommendation.${r}`)}</option>
            ))}
          </Select>
        </Section>
      )}
    </div>
  );
}
