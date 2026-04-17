import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Icon } from "../../components/layout/Icon";
import { drivers, vehicles } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { Driver } from "../../types";

const STATUS_TONE: Record<Driver["status"], "success" | "warning" | "danger"> = {
  ACTIVE: "success", ON_LEAVE: "warning", SUSPENDED: "danger",
};

const STEPS = [
  { label: "Informations personnelles", icon: "idcard" as const },
  { label: "Documents",                  icon: "clipboard" as const },
  { label: "Affectation véhicule",       icon: "car" as const },
];

interface FormState {
  name: string;
  phone: string;
  email: string;
  employeeId: string;
  hiredAt: string;
  licenseExpiry: string;
  licenseFile: File | null;
  idCardFile: File | null;
  photoFile: File | null;
  vehicleId: string;
}

const EMPTY: FormState = {
  name: "", phone: "", email: "", employeeId: "",
  hiredAt: "", licenseExpiry: "",
  licenseFile: null, idCardFile: null, photoFile: null,
  vehicleId: "",
};

function FileDropZone({
  label, hint, file, accept, onChange,
}: {
  label: string;
  hint?: string;
  file: File | null;
  accept?: string;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={cn(
        "w-full flex flex-col items-center gap-2 py-6 px-4 rounded-[10px] border border-dashed transition-base text-center",
        file
          ? "border-brand-500 bg-brand-50"
          : "border-[color:var(--color-border)] hover:border-brand-500 hover:bg-[#f6f8ff]",
      )}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file ? (
        <>
          <Icon name="check" size={20} className="text-brand-500" />
          <p className="text-[13px] font-medium text-brand-500 truncate max-w-full">{file.name}</p>
          <p className="text-[11.5px] text-[color:var(--color-muted)]">Cliquer pour remplacer</p>
        </>
      ) : (
        <>
          <Icon name="upload" size={20} className="text-[color:var(--color-muted)]" />
          <p className="text-[13px] font-medium text-ink">{label}</p>
          {hint && <p className="text-[11.5px] text-[color:var(--color-muted)]">{hint}</p>}
        </>
      )}
    </button>
  );
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-base",
                i < current  && "bg-brand-500 text-white",
                i === current && "bg-brand-500 text-white ring-4 ring-brand-500/20",
                i > current  && "bg-[#f1f3f8] text-ink-soft",
              )}
            >
              {i < current ? <Icon name="check" size={14} /> : i + 1}
            </div>
            <span className={cn(
              "text-[11px] font-medium text-center leading-tight whitespace-nowrap",
              i === current ? "text-brand-500" : "text-[color:var(--color-muted)]",
            )}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={cn(
              "flex-1 h-px mx-3 mb-5 transition-base",
              i < current ? "bg-brand-500" : "bg-[#e5e8f0]",
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Drivers() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | Driver["status"]>("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (patch: Partial<FormState>) => setForm((s) => ({ ...s, ...patch }));

  const step1Valid = form.name.trim() && form.phone.trim() && form.employeeId.trim() && form.hiredAt && form.licenseExpiry;
  const step2Valid = form.licenseFile && form.idCardFile;

  const openModal = () => { setStep(0); setForm(EMPTY); setOpen(true); };
  const closeModal = () => setOpen(false);

  const handleNext = () => {
    if (step === 0 && !step1Valid) { toast.error("Veuillez remplir tous les champs obligatoires"); return; }
    if (step === 1 && !step2Valid) { toast.error("Permis de conduire et carte d'identité requis"); return; }
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = (skipVehicle = false) => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success(`Chauffeur ${form.name} ajouté${skipVehicle || !form.vehicleId ? "" : ` · Véhicule ${vehicles.find((v) => v.id === form.vehicleId)?.plate ?? ""} affecté`}`);
    }, 600);
  };

  const rows = useMemo(() => drivers.filter((d) => {
    if (status && d.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      return [d.name, d.phone, d.employeeId].some((x) => x.toLowerCase().includes(s));
    }
    return true;
  }), [q, status]);

  const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE" && !v.assignedDriverId);

  const footer = (
    <div className="flex items-center justify-between w-full">
      <Button variant="ghost" onClick={step === 0 ? closeModal : handleBack}>
        {step === 0 ? t("common.cancel") : t("common.previous")}
      </Button>
      <div className="flex gap-2">
        {step === 2 && (
          <Button variant="outline" onClick={() => handleSubmit(true)} loading={submitting}>
            Passer
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={handleNext}>{t("common.next")}</Button>
        ) : (
          <Button onClick={() => handleSubmit(false)} loading={submitting} leftIcon={<Icon name="check" size={16} />}>
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title={t("driver.title")}
        subtitle={`${rows.length} chauffeur(s)`}
        actions={<Button leftIcon={<Icon name="plus" size={16} />} onClick={openModal}>Ajouter</Button>}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search") as string} leftIcon={<Icon name="search" size={16} />} />
          </div>
          <div className="w-52">
            <Select value={status} onChange={(e) => setStatus(e.target.value as Driver["status"])}>
              <option value="">{t("common.status")} · {t("common.all")}</option>
              {(["ACTIVE","ON_LEAVE","SUSPENDED"] as Driver["status"][]).map((s) => (
                <option key={s} value={s}>{t(`driver.status.${s}`)}</option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          onRowClick={(r) => nav(`/fleet/drivers/${r.id}`)}
          columns={[
            { key: "drv", header: t("driver.fields.name"), cell: (r) => (
              <div className="flex items-center gap-3">
                <Avatar name={r.name} />
                <div>
                  <p className="text-[13.5px] font-medium text-ink">{r.name}</p>
                  <p className="text-[12px] text-[color:var(--color-muted)]">{r.employeeId}</p>
                </div>
              </div>
            )},
            { key: "ph",  header: t("common.phone"), cell: (r) => r.phone },
            { key: "lic", header: "Permis expire",  cell: (r) => formatDate(r.licenseExpiry) },
            { key: "rat", header: "Note",           cell: (r) => <span className="inline-flex items-center gap-1"><Icon name="star" size={14} className="text-warning-500" /><span className="tabular-nums">{r.rating.toFixed(1)}</span></span> },
            { key: "st",  header: t("common.status"), cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{t(`driver.status.${r.status}`)}</Badge> },
          ]}
        />
      </Card>

      <Modal
        open={open}
        onClose={closeModal}
        title="Nouveau chauffeur"
        size="lg"
        footer={footer}
      >
        <StepIndicator current={step} />

        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Nom complet" required className="sm:col-span-2">
              <Input
                value={form.name}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="Jean Dibango"
                autoFocus
              />
            </FormField>
            <FormField label={t("common.phone")} required>
              <Input
                value={form.phone}
                onChange={(e) => set({ phone: e.target.value })}
                placeholder="+237 6xx xx xx xx"
              />
            </FormField>
            <FormField label={t("common.email")} optional>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="jean@exemple.com"
              />
            </FormField>
            <FormField label={t("driver.fields.driverId")} required>
              <Input
                value={form.employeeId}
                onChange={(e) => set({ employeeId: e.target.value })}
                placeholder="EMP-007"
              />
            </FormField>
            <FormField label="Date d'embauche" required>
              <Input
                type="date"
                value={form.hiredAt}
                onChange={(e) => set({ hiredAt: e.target.value })}
              />
            </FormField>
            <FormField label="Expiration du permis" required className="sm:col-span-2">
              <Input
                type="date"
                value={form.licenseExpiry}
                onChange={(e) => set({ licenseExpiry: e.target.value })}
              />
            </FormField>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Permis de conduire" required>
                <FileDropZone
                  label="Importer le permis"
                  hint="JPG, PNG ou PDF · max 5 Mo"
                  file={form.licenseFile}
                  accept="image/*,.pdf"
                  onChange={(f) => set({ licenseFile: f })}
                />
              </FormField>
              <FormField label="Carte nationale d'identité" required>
                <FileDropZone
                  label="Importer la CNI"
                  hint="JPG, PNG ou PDF · max 5 Mo"
                  file={form.idCardFile}
                  accept="image/*,.pdf"
                  onChange={(f) => set({ idCardFile: f })}
                />
              </FormField>
            </div>
            <FormField label="Photo de profil" optional>
              <FileDropZone
                label="Importer une photo"
                hint="JPG ou PNG · max 2 Mo · format portrait recommandé"
                file={form.photoFile}
                accept="image/*"
                onChange={(f) => set({ photoFile: f })}
              />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <p className="text-[13.5px] text-[color:var(--color-muted)] leading-relaxed">
              Vous pouvez affecter immédiatement un véhicule disponible à ce chauffeur, ou le faire plus tard depuis la fiche du chauffeur.
            </p>
            {availableVehicles.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Icon name="car" size={32} className="text-[color:var(--color-muted-soft)]" />
                <p className="text-[13.5px] text-[color:var(--color-muted)]">Aucun véhicule disponible pour le moment</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {availableVehicles.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => set({ vehicleId: form.vehicleId === v.id ? "" : v.id })}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-[10px] border text-left transition-base",
                      form.vehicleId === v.id
                        ? "border-brand-500 bg-brand-50"
                        : "border-[color:var(--color-border)] hover:border-brand-500/40 hover:bg-[#f6f8ff]",
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center shrink-0",
                      form.vehicleId === v.id ? "bg-brand-500 text-white" : "bg-[#f1f3f8] text-[color:var(--color-muted)]",
                    )}>
                      <Icon name="car" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-ink">{v.plate} · {v.brand} {v.model}</p>
                      <p className="text-[12px] text-[color:var(--color-muted)]">{v.year} · {v.fuelType} · {v.currentKm.toLocaleString()} km</p>
                    </div>
                    {form.vehicleId === v.id && (
                      <Icon name="check" size={16} className="text-brand-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
