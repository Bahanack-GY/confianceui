import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "../../components/ui/PageHeader";
import { Section } from "../../components/ui/Section";
import { Card, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { FormField } from "../../components/ui/FormField";
import { Table } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { PhotoUpload } from "../../components/ui/PhotoUpload";
import { drivers, incidents, vehicles } from "../../lib/mock-data";
import { useAuth } from "../../lib/auth";
import { formatDate } from "../../lib/utils";
import type { IncidentType } from "../../types";

export default function DriverIncidents() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const me = drivers.find((d) => d.email === user?.email) ?? drivers[0];
  const myVehicle = vehicles.find((v) => v.assignedDriverId === me.id);
  const mine = incidents.filter((i) => i.driverId === me.id);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Incident signalé");
      (e.target as HTMLFormElement).reset();
    }, 500);
  };

  return (
    <div>
      <PageHeader title={t("nav.reportIncident")} subtitle={me.name} />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={onSubmit} className="lg:col-span-2">
          <Section title={t("incident.sections.general")}>
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("incident.fields.reportedBy")}><Input defaultValue={me.name} readOnly /></FormField>
                <FormField label={t("common.date")} required><Input type="date" required /></FormField>
                <FormField label={t("common.time")} required><Input type="time" required /></FormField>
                <FormField label={t("incident.fields.location")} required><Input leftIcon={<Icon name="location" size={14} />} required /></FormField>
              </div>
            </Card>
          </Section>

          <Section title={t("incident.sections.details")}>
            <Card>
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField label={t("incident.fields.vehicleId")}>
                  <Input
                    value={myVehicle ? `${myVehicle.plate} · ${myVehicle.brand} ${myVehicle.model}` : "—"}
                    readOnly
                  />
                </FormField>
                <FormField label={t("incident.fields.tripId")}><Input placeholder="T-1000" /></FormField>
                <FormField label={t("incident.fields.type")} required>
                  <Select required defaultValue="">
                    <option value="" disabled>{t("common.all")}</option>
                    {(["ACCIDENT","ACCIDENT_MINOR","THEFT","FIRE","SECURITY","BREAKDOWN","CLIENT_CONFLICT","OTHER"] as IncidentType[]).map((tt) => (
                      <option key={tt} value={tt}>{t(`incident.type.${tt}`)}</option>
                    ))}
                  </Select>
                </FormField>
                <FormField label={t("incident.fields.description")} required className="sm:col-span-3">
                  <Textarea rows={4} required placeholder="Expliquez clairement ce qui s'est passé..." />
                </FormField>
              </div>
            </Card>
          </Section>

          <Section title={t("incident.sections.damages")}>
            <Card><FormField><Textarea placeholder="Dommages liés au véhicule / personnes" /></FormField></Card>
          </Section>

          <Section title={t("incident.sections.actions")}>
            <Card><FormField><Textarea placeholder="Mesures prises" /></FormField></Card>
          </Section>

          <Section title={t("incident.photos.title")}>
            <Card><PhotoUpload maxFiles={5} /></Card>
          </Section>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="reset">{t("common.cancel")}</Button>
            <Button type="submit" loading={submitting} leftIcon={<Icon name="check" size={16} />}>{t("common.submit")}</Button>
          </div>
        </form>

        <div>
          <Card padded={false}>
            <CardHeader className="px-5 pt-5" title="Mes incidents" subtitle={`${mine.length} signalement(s)`} />
            <Table
              rowKey={(r) => r.id}
              rows={mine}
              columns={[
                { key: "ref",  header: "Réf",  cell: (r) => <span className="font-mono text-[12.5px] text-brand-500">#{r.ref}</span> },
                { key: "d",    header: t("common.date"), cell: (r) => formatDate(r.date) },
                { key: "type", header: t("incident.fields.type"), cell: (r) => <Badge tone="warning">{t(`incident.type.${r.type}`)}</Badge> },
                { key: "st",   header: t("common.status"), cell: (r) => <Badge tone={r.status === "CLOSED" ? "success" : "warning"}>{t(`incident.status.${r.status}`)}</Badge> },
              ]}
              empty="Aucun"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
