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
import { Modal } from "../../components/ui/Modal";
import { FormField } from "../../components/ui/FormField";
import { Icon } from "../../components/layout/Icon";
import { vehicles, drivers } from "../../lib/mock-data";
import { formatDate } from "../../lib/utils";
import { cn } from "../../lib/utils";
import type { FuelType, Vehicle } from "../../types";

const STATUS_TONE: Record<Vehicle["status"], "success" | "brand" | "warning" | "danger"> = {
  AVAILABLE: "success", ON_TRIP: "brand", MAINTENANCE: "warning", OUT_OF_SERVICE: "danger",
};

const STEPS = [
  { label: "Informations" },
  { label: "Carte grise" },
  { label: "Photos" },
];

interface FormState {
  label: string;
  brand: string;
  model: string;
  chassis: string;
  plate: string;
  year: string;
  acquiredAt: string;
  condition: "new" | "used";
  initialKm: string;
  fuelType: FuelType | "";
  carteGriseFile: File | null;
  photos: File[];
}

const EMPTY: FormState = {
  label: "", brand: "", model: "", chassis: "", plate: "",
  year: new Date().getFullYear().toString(),
  acquiredAt: "", condition: "new", initialKm: "0", fuelType: "",
  carteGriseFile: null, photos: [],
};

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5 min-w-0">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-base",
              i < current  && "bg-brand-500 text-white",
              i === current && "bg-brand-500 text-white ring-4 ring-brand-500/20",
              i > current  && "bg-[#f1f3f8] text-ink-soft",
            )}>
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

function FileDropZone({ label, hint, file, accept, onChange }: {
  label: string; hint?: string; file: File | null; accept?: string;
  onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => ref.current?.click()}
      className={cn(
        "w-full flex flex-col items-center gap-2 py-8 px-4 rounded-[10px] border border-dashed transition-base text-center",
        file
          ? "border-brand-500 bg-brand-50"
          : "border-[color:var(--color-border)] hover:border-brand-500 hover:bg-[#f6f8ff]",
      )}
    >
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      {file ? (
        <>
          <Icon name="check" size={22} className="text-brand-500" />
          <p className="text-[13px] font-medium text-brand-500 truncate max-w-full">{file.name}</p>
          <p className="text-[11.5px] text-[color:var(--color-muted)]">Cliquer pour remplacer</p>
        </>
      ) : (
        <>
          <Icon name="upload" size={22} className="text-[color:var(--color-muted)]" />
          <p className="text-[13px] font-medium text-ink">{label}</p>
          {hint && <p className="text-[11.5px] text-[color:var(--color-muted)]">{hint}</p>}
        </>
      )}
    </button>
  );
}

function PhotoGrid({ photos, onAdd, onRemove }: {
  photos: File[]; onAdd: (files: File[]) => void; onRemove: (i: number) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        ref={ref} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => {
          if (e.target.files) onAdd(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
      <div className="grid grid-cols-3 gap-3">
        {photos.map((f, i) => (
          <div key={i} className="relative group aspect-[4/3] rounded-[10px] overflow-hidden border border-[color:var(--color-border-soft)] bg-[#f6f7fb]">
            <img src={URL.createObjectURL(f)} alt={f.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-[#0b1020]/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-base"
            >
              <Icon name="close" size={12} />
            </button>
          </div>
        ))}
        {photos.length < 8 && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="aspect-[4/3] rounded-[10px] border border-dashed border-[color:var(--color-border)] hover:border-brand-500 hover:bg-[#f6f8ff] flex flex-col items-center justify-center gap-1.5 transition-base"
          >
            <Icon name="plus" size={20} className="text-[color:var(--color-muted)]" />
            <span className="text-[11.5px] text-[color:var(--color-muted)]">Ajouter</span>
          </button>
        )}
      </div>
      {photos.length === 0 && (
        <p className="text-center text-[13px] text-[color:var(--color-muted)] mt-4">
          Aucune photo · cliquez sur le bouton ci-dessus pour en ajouter
        </p>
      )}
    </div>
  );
}

export default function Vehicles() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | Vehicle["status"]>("");
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const set = (patch: Partial<FormState>) => setForm((s) => ({ ...s, ...patch }));

  const step1Valid = form.brand.trim() && form.model.trim() && form.plate.trim() && form.acquiredAt && form.fuelType
    && (form.condition === "new" || form.initialKm.trim() !== "");

  const openModal = () => { setStep(0); setForm(EMPTY); setOpen(true); };
  const closeModal = () => setOpen(false);

  const handleNext = () => {
    if (step === 0 && !step1Valid) { toast.error("Veuillez remplir tous les champs obligatoires"); return; }
    if (step === 1 && !form.carteGriseFile) { toast.error("La carte grise est requise"); return; }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success(`Véhicule ${form.plate || form.label} ajouté`);
    }, 600);
  };

  const rows = useMemo(() => vehicles.filter((v) => {
    if (status && v.status !== status) return false;
    if (q) {
      const s = q.toLowerCase();
      return [v.plate, v.brand, v.model].some((x) => x.toLowerCase().includes(s));
    }
    return true;
  }), [q, status]);

  const footer = (
    <div className="flex items-center justify-between w-full">
      <Button variant="ghost" onClick={step === 0 ? closeModal : () => setStep((s) => s - 1)}>
        {step === 0 ? t("common.cancel") : t("common.previous")}
      </Button>
      <div className="flex gap-2">
        {step === 2 && (
          <Button variant="outline" onClick={handleSubmit} loading={submitting}>Passer</Button>
        )}
        {step < 2 ? (
          <Button onClick={handleNext}>{t("common.next")}</Button>
        ) : (
          <Button onClick={handleSubmit} loading={submitting} leftIcon={<Icon name="check" size={16} />}>
            Enregistrer
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title={t("vehicle.title")}
        subtitle={`${rows.length} véhicule(s)`}
        actions={<Button leftIcon={<Icon name="plus" size={16} />} onClick={openModal}>Ajouter</Button>}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search") as string} leftIcon={<Icon name="search" size={16} />} />
          </div>
          <div className="w-52">
            <Select value={status} onChange={(e) => setStatus(e.target.value as Vehicle["status"])}>
              <option value="">{t("common.status")} · {t("common.all")}</option>
              <option value="AVAILABLE">{t("vehicle.status.AVAILABLE")}</option>
              <option value="ON_TRIP">{t("vehicle.status.ON_TRIP")}</option>
              <option value="MAINTENANCE">{t("vehicle.status.MAINTENANCE")}</option>
              <option value="OUT_OF_SERVICE">{t("vehicle.status.OUT_OF_SERVICE")}</option>
            </Select>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <Table
          rowKey={(r) => r.id}
          rows={rows}
          onRowClick={(r) => nav(`/fleet/vehicles/${r.id}`)}
          columns={[
            { key: "plate", header: t("vehicle.fields.plate"), cell: (r) => (
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
                  <Icon name="car" size={16} />
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-ink">{r.plate}</p>
                  <p className="text-[12px] text-[color:var(--color-muted)]">{r.brand} {r.model} · {r.year}</p>
                </div>
              </div>
            )},
            { key: "fuel",  header: t("vehicle.fields.fuelType"),        cell: (r) => <Badge tone="neutral">{r.fuelType}</Badge> },
            { key: "km",    header: t("vehicle.fields.currentKm"),       cell: (r) => <span className="tabular-nums">{r.currentKm.toLocaleString()} km</span>, align: "right" },
            { key: "drv",   header: t("vehicle.fields.driver"),          cell: (r) => drivers.find((d) => d.id === r.assignedDriverId)?.name ?? "—" },
            { key: "ins",   header: t("vehicle.fields.insuranceExpiry"), cell: (r) => formatDate(r.insuranceExpiry) },
            { key: "st",    header: t("common.status"),                  cell: (r) => <Badge tone={STATUS_TONE[r.status]}>{t(`vehicle.status.${r.status}`)}</Badge> },
          ]}
        />
      </Card>

      <Modal open={open} onClose={closeModal} title="Nouveau véhicule" size="lg" footer={footer}>
        <StepIndicator current={step} />

        {/* ── Step 1 : Informations ── */}
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Libellé interne" optional className="sm:col-span-2">
              <Input
                value={form.label}
                onChange={(e) => set({ label: e.target.value })}
                placeholder="ex. Véhicule présidentiel #1"
                autoFocus
              />
            </FormField>

            <FormField label={t("vehicle.fields.brand")} required>
              <Input value={form.brand} onChange={(e) => set({ brand: e.target.value })} placeholder="Toyota" />
            </FormField>
            <FormField label={t("vehicle.fields.model")} required>
              <Input value={form.model} onChange={(e) => set({ model: e.target.value })} placeholder="Land Cruiser" />
            </FormField>

            <FormField label="N° de châssis">
              <Input value={form.chassis} onChange={(e) => set({ chassis: e.target.value })} placeholder="JTMHX05J704024810" />
            </FormField>
            <FormField label={t("vehicle.fields.plate")} required>
              <Input value={form.plate} onChange={(e) => set({ plate: e.target.value })} placeholder="LT 1234 A" />
            </FormField>

            <FormField label={t("vehicle.fields.year")}>
              <Input type="number" min={1990} max={new Date().getFullYear() + 1}
                value={form.year} onChange={(e) => set({ year: e.target.value })} />
            </FormField>
            <FormField label="Date d'acquisition" required>
              <Input type="date" value={form.acquiredAt} onChange={(e) => set({ acquiredAt: e.target.value })} />
            </FormField>

            <FormField label={t("vehicle.fields.fuelType")} required>
              <Select value={form.fuelType} onChange={(e) => set({ fuelType: e.target.value as FuelType })}>
                <option value="" disabled>Sélectionner...</option>
                <option value="DIESEL">Diesel</option>
                <option value="GASOLINE">Essence</option>
                <option value="HYBRID">Hybride</option>
              </Select>
            </FormField>

            <FormField label="État" required>
              <div className="flex gap-3 h-10 items-center">
                {(["new", "used"] as const).map((c) => (
                  <label key={c} className={cn(
                    "flex-1 h-10 flex items-center justify-center gap-2 rounded-[10px] border text-[13px] font-medium cursor-pointer transition-base",
                    form.condition === c
                      ? "border-brand-500 bg-brand-50 text-brand-500"
                      : "border-[color:var(--color-border)] text-ink-soft hover:border-brand-500/40",
                  )}>
                    <input type="radio" name="condition" value={c} checked={form.condition === c}
                      onChange={() => set({ condition: c, initialKm: c === "new" ? "0" : form.initialKm === "0" ? "" : form.initialKm })}
                      className="sr-only" />
                    {c === "new" ? "Neuf" : "Occasion"}
                  </label>
                ))}
              </div>
            </FormField>

            {form.condition === "used" && (
              <FormField label="Kilométrage initial" required className="sm:col-span-2">
                <Input
                  type="number"
                  min={0}
                  value={form.initialKm}
                  onChange={(e) => set({ initialKm: e.target.value })}
                  placeholder="ex. 45000"
                />
              </FormField>
            )}
          </div>
        )}

        {/* ── Step 2 : Carte grise ── */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[color:var(--color-muted)]">
              Importez le scan ou la photo de la carte grise du véhicule. Ce document sera requis pour les contrôles de conformité.
            </p>
            <FileDropZone
              label="Importer la carte grise"
              hint="JPG, PNG ou PDF · max 10 Mo"
              file={form.carteGriseFile}
              accept="image/*,.pdf"
              onChange={(f) => set({ carteGriseFile: f })}
            />
            {form.carteGriseFile && (
              <div className="flex items-center gap-3 p-3 rounded-[10px] bg-brand-50 border border-brand-500/20">
                <Icon name="file" size={16} className="text-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-brand-500 truncate">{form.carteGriseFile.name}</p>
                  <p className="text-[11.5px] text-[color:var(--color-muted)]">
                    {(form.carteGriseFile.size / 1024).toFixed(0)} Ko
                  </p>
                </div>
                <button type="button" onClick={() => set({ carteGriseFile: null })}
                  className="text-[color:var(--color-muted)] hover:text-danger-500 transition-base">
                  <Icon name="close" size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3 : Photos ── */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-[13.5px] text-[color:var(--color-muted)]">
              Ajoutez des photos du véhicule (extérieur, intérieur, tableau de bord…). Cette étape est optionnelle.
            </p>
            <PhotoGrid
              photos={form.photos}
              onAdd={(files) => set({ photos: [...form.photos, ...files].slice(0, 8) })}
              onRemove={(i) => set({ photos: form.photos.filter((_, idx) => idx !== i) })}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
