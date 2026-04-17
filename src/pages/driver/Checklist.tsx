import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "../../components/ui/PageHeader";
import { Section } from "../../components/ui/Section";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { FormField } from "../../components/ui/FormField";
import { Select } from "../../components/ui/Select";
import { Icon } from "../../components/layout/Icon";
import { vehicles, drivers } from "../../lib/mock-data";
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";

const ITEMS = [
  { id: "body",        key: "checklist.items.body" },
  { id: "tires",       key: "checklist.items.tires" },
  { id: "levels",      key: "checklist.items.levels" },
  { id: "lights",      key: "checklist.items.lights" },
  { id: "cleanliness", key: "checklist.items.cleanliness" },
  { id: "documents",   key: "checklist.items.documents" },
] as const;

type State = "OK" | "KO" | null;

export default function Checklist() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();
  const me = drivers.find((d) => d.email === user?.email) ?? drivers[0];
  const myVehicle = vehicles.find((v) => v.assignedDriverId === me.id) ?? vehicles[0];
  const [values, setValues] = useState<Record<string, { state: State; notes: string }>>(
    ITEMS.reduce((acc, i) => ({ ...acc, [i.id]: { state: null, notes: "" } }), {}),
  );
  const [submitting, setSubmitting] = useState(false);

  const setItem = (id: string, patch: Partial<{ state: State; notes: string }>) =>
    setValues((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incomplete = ITEMS.some((i) => values[i.id].state === null);
    if (incomplete) {
      toast.error("Veuillez compléter tous les éléments");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Check-list enregistrée");
      nav("/driver");
    }, 500);
  };

  return (
    <form onSubmit={onSubmit}>
      <PageHeader
        title={t("checklist.title")}
        subtitle={t("checklist.subtitle")}
        actions={
          <Button type="submit" loading={submitting} leftIcon={<Icon name="check" size={16} />}>
            {t("checklist.submit")}
          </Button>
        }
      />

      <Section title={t("checklist.sections.header")}>
        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label={t("vehicle.fields.plate")} required>
              <Select defaultValue={myVehicle.id}>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.plate}</option>)}
              </Select>
            </FormField>
            <FormField label={t("driver.fields.name")}><Input defaultValue={me.name} readOnly /></FormField>
            <FormField label={t("common.date")} required><Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></FormField>
          </div>
        </Card>
      </Section>

      <Section title={t("checklist.sections.items")}>
        <Card padded={false}>
          <div className="divide-y divide-[color:var(--color-border-soft)]">
            {ITEMS.map((item) => {
              const v = values[item.id];
              return (
                <div key={item.id} className="p-4 grid gap-3 md:grid-cols-[1fr_200px_1fr] items-start">
                  <div className="flex items-start gap-3">
                    <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mt-0.5">
                      <Icon name="check" size={14} />
                    </span>
                    <div>
                      <p className="text-[14px] font-medium text-ink">{t(item.key)}</p>
                      <p className="text-[12px] text-[color:var(--color-muted)]">{t("checklist.element")}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <StateButton active={v.state === "OK"} tone="ok" onClick={() => setItem(item.id, { state: "OK" })}>OK</StateButton>
                    <StateButton active={v.state === "KO"} tone="ko" onClick={() => setItem(item.id, { state: "KO" })}>KO</StateButton>
                  </div>
                  <Input
                    value={v.notes}
                    onChange={(e) => setItem(item.id, { notes: e.target.value })}
                    placeholder={t("checklist.observations") as string}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      </Section>

      <Section title={t("checklist.kmStart")}>
        <Card>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label={t("checklist.kmStart")} required><Input type="number" min={0} defaultValue={myVehicle.currentKm} required /></FormField>
            <FormField label={t("common.time")}><Input type="time" defaultValue={new Date().toTimeString().slice(0, 5)} /></FormField>
            <FormField label={t("checklist.additionalRemarks")} className="sm:col-span-2"><Textarea /></FormField>
          </div>
        </Card>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => nav("/driver")}>{t("common.cancel")}</Button>
        <Button type="submit" loading={submitting} leftIcon={<Icon name="check" size={16} />}>{t("checklist.submit")}</Button>
      </div>
    </form>
  );
}

function StateButton({ children, active, tone, onClick }: { children: React.ReactNode; active: boolean; tone: "ok" | "ko"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 h-10 px-3 rounded-[10px] text-[13px] font-medium transition-base border border-[color:var(--color-border)]",
        !active && "bg-white text-ink-soft hover:bg-[#f6f7fb]",
        active && tone === "ok" && "bg-success-500 text-white border-success-500",
        active && tone === "ko" && "bg-danger-500 text-white border-danger-500",
      )}
    >
      {children}
    </button>
  );
}
