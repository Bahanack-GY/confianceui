import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "../../components/ui/PageHeader";
import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/layout/Icon";

interface Props {
  role: "DISPATCH_SUPERVISOR" | "DISPATCH_AGENT";
  backPath: string;
}

export default function ShiftReportForm({ role, backPath }: Props) {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const isSupervisor = role === "DISPATCH_SUPERVISOR";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(t("common.save") + " ✓");
      nav(backPath);
    }, 500);
  };

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title={t("shiftReport.title")}
        subtitle={t(`role.${role}`)}
        actions={
          <>
            <Button variant="outline" type="button" onClick={() => nav(backPath)} leftIcon={<Icon name="left" size={16} />}>
              {t("common.back")}
            </Button>
            <Button type="submit" loading={submitting} leftIcon={<Icon name="check" size={16} />}>
              {t("common.submit")}
            </Button>
          </>
        }
      />

      <Section title={t("shiftReport.sections.general")}>
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("shiftReport.fields.supervisorName")} required><Input required /></FormField>
            <FormField label={t("shift.concerned")} required>
              <Select required defaultValue="MORNING">
                <option value="MORNING">{t("shift.MORNING")}</option>
                <option value="EVENING">{t("shift.EVENING")}</option>
                <option value="NIGHT">{t("shift.NIGHT")}</option>
              </Select>
            </FormField>
            {isSupervisor && (
              <FormField label={t("shiftReport.fields.agents")} className="sm:col-span-2" hint="Séparer les noms par virgule">
                <Input placeholder="Marie Nguemo, Clément Ondoa" />
              </FormField>
            )}
            <FormField label={t("common.date")} required><Input type="date" required /></FormField>
          </div>
        </Card>
      </Section>

      <Section title={t("shiftReport.sections.operations")}>
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("shiftReport.fields.totalTrips")} required><Input type="number" min={0} required /></FormField>
            <FormField label={t("shiftReport.fields.successTrips")} required><Input type="number" min={0} required /></FormField>
            <FormField label={t("shiftReport.fields.cancelledTrips")} required><Input type="number" min={0} required /></FormField>
            <FormField label={t("shiftReport.fields.cancelReasons")} className="sm:col-span-3"><Textarea placeholder="Client absent, zone éloignée..." /></FormField>
            <FormField label={t("shiftReport.fields.refusedTrips")} required><Input type="number" min={0} required /></FormField>
            <FormField label={t("shiftReport.fields.refuseReasons")} className="sm:col-span-2"><Textarea /></FormField>
          </div>
        </Card>
      </Section>

      <Section title={t("shiftReport.sections.performance")}>
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("shiftReport.fields.avgWaitTime")}><Input type="number" step="0.1" min={0} /></FormField>
            <FormField label={t("shiftReport.fields.avgAssignTime")}><Input type="number" step="0.1" min={0} /></FormField>
            <FormField label={t("shiftReport.fields.reassignments")}><Input type="number" min={0} /></FormField>
            <FormField label={t("shiftReport.fields.cancelRate")} hint="Calculé automatiquement (%)"><Input type="number" step="0.1" min={0} max={100} disabled /></FormField>
            <FormField label={t("shiftReport.fields.successRate")} hint="Calculé automatiquement (%)"><Input type="number" step="0.1" min={0} max={100} disabled /></FormField>
          </div>
        </Card>
      </Section>

      {isSupervisor && (
        <>
          <Section title={t("shiftReport.sections.handover")}>
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label={t("shiftReport.fields.ongoingTrips")}><Textarea /></FormField>
                <FormField label={t("shiftReport.fields.ongoingIncidents")}><Textarea /></FormField>
                <FormField label={t("shiftReport.fields.criticalZones")}><Textarea /></FormField>
                <FormField label={t("shiftReport.fields.driversFleet")}><Textarea /></FormField>
                <FormField label={t("shiftReport.fields.priorities")} className="sm:col-span-2"><Textarea /></FormField>
              </div>
            </Card>
          </Section>

          <Section title={t("shiftReport.sections.handoffIndications")}>
            <Card>
              <FormField hint={t("shiftReport.fields.handoffNotes")}>
                <Textarea rows={5} placeholder="Décrire tout process qui permettra de faciliter la passation de service..." />
              </FormField>
            </Card>
          </Section>
        </>
      )}

      <div className="flex justify-end gap-2 sticky bottom-0 bg-[color:var(--color-surface-alt)] py-4 mt-4">
        <Button variant="outline" type="button" onClick={() => nav(backPath)}>{t("common.cancel")}</Button>
        <Button type="submit" loading={submitting} leftIcon={<Icon name="check" size={16} />}>{t("common.submit")}</Button>
      </div>
    </form>
  );
}
