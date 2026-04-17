import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/layout/Icon";
import { DateRangeFilter } from "../../components/ui/DateRangeFilter";
import {
  trips, incidents, vehicles, drivers, fuelEntries, shiftReports,
  driverSheets, expenses, zonalStats, weeklyRevenueTotals,
} from "../../lib/mock-data";
import {
  generateCSV, downloadCSV, formatDate, formatCurrency,
  percent, getPresetRange, oilChangeStatus,
} from "../../lib/utils";
import type { Role } from "../../types";
import type { DatePreset} from "../../lib/utils";
import { cn } from "../../lib/utils";

interface Props { role: Exclude<Role, "DRIVER"> }

interface ReportDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  categoryTone: "brand" | "success" | "warning" | "info" | "neutral" | "danger";
  rows: () => (string | number | null | undefined)[][];
  headers: string[];
  filename: string;
}

const TODAY_STR = new Date().toISOString().slice(0, 10);

function buildReports(role: Props["role"], t: (k: string) => string): ReportDef[] {
  const dispatch: ReportDef[] = [
    {
      id: "trips",
      title: "Synthèse des courses",
      description: "Toutes les courses avec statut, chauffeur, véhicule et horodatage.",
      icon: "route",
      category: t("reports.categories.dispatch"),
      categoryTone: "brand",
      headers: ["ID", "Client", "Départ", "Arrivée", "Chauffeur", "Véhicule", "Statut", "Demandée le"],
      rows: () => trips.map((tr) => [
        tr.id, tr.clientName, tr.pickup, tr.dropoff,
        drivers.find((d) => d.id === tr.driverId)?.name ?? "—",
        vehicles.find((v) => v.id === tr.vehicleId)?.plate ?? "—",
        t(`trip.status.${tr.status}`),
        formatDate(tr.requestedAt),
      ]),
      filename: `courses_${TODAY_STR}.csv`,
    },
    {
      id: "shift-reports",
      title: "Rapports de shift",
      description: "Synthèse des rapports de fin de shift avec indicateurs de performance.",
      icon: "clipboard",
      category: t("reports.categories.dispatch"),
      categoryTone: "brand",
      headers: ["Date", "Shift", "Superviseur", "Courses totales", "Réussites", "Annulées", "Refusées", "Taux succès", "Taux annulation", "Temps attente moy.", "Réassignations"],
      rows: () => shiftReports.map((r) => [
        formatDate(r.date), t(`shift.${r.shiftSlot}`), r.supervisorName ?? "—",
        r.totalTrips, r.successTrips, r.cancelledTrips, r.refusedTrips,
        percent(r.successRate), percent(r.cancelRate),
        `${r.avgWaitTimeMin} min`, r.reassignments,
      ]),
      filename: `rapports_shift_${TODAY_STR}.csv`,
    },
    {
      id: "incidents",
      title: "Matrice des incidents",
      description: "Tous les incidents signalés avec type, localisation et statut de résolution.",
      icon: "alert",
      category: t("reports.categories.incidents"),
      categoryTone: "warning",
      headers: ["Réf", "Date", "Heure", "Signalé par", "Service", "Type", "Localisation", "Description", "Dommages", "Actions prises", "Statut"],
      rows: () => incidents.map((i) => [
        `#${i.ref}`, formatDate(i.date), i.time, i.reportedBy, i.service,
        t(`incident.type.${i.type}`), i.location,
        i.description, i.damages ?? "—", i.actionsTaken ?? "—",
        t(`incident.status.${i.status}`),
      ]),
      filename: `incidents_${TODAY_STR}.csv`,
    },
  ];

  const fleet: ReportDef[] = [
    {
      id: "fleet",
      title: "État de la flotte",
      description: "Tableau complet des véhicules avec kilomètres, statut, conformité et vidange.",
      icon: "car",
      category: t("reports.categories.fleet"),
      categoryTone: "info",
      headers: ["Immatriculation", "Marque", "Modèle", "Année", "Carburant", "KM actuel", "Statut", "Chauffeur", "Assurance expire", "Carte grise expire", "Dernière vidange", "KM à la vidange", "Prochain entretien KM", "État vidange"],
      rows: () => vehicles.map((v) => {
        const drv = drivers.find((d) => d.id === v.assignedDriverId);
        const st  = oilChangeStatus(v);
        return [
          v.plate, v.brand, v.model, v.year, v.fuelType,
          v.currentKm, t(`vehicle.status.${v.status}`), drv?.name ?? "—",
          formatDate(v.insuranceExpiry), formatDate(v.registrationExpiry),
          v.lastOilChange ? formatDate(v.lastOilChange) : "—",
          v.kmAtLastOilChange ?? "—",
          v.kmAtLastOilChange ? v.kmAtLastOilChange + 5000 : "—",
          t(`vehicle.oilChange.${st}`),
        ];
      }),
      filename: `flotte_${TODAY_STR}.csv`,
    },
    {
      id: "fuel",
      title: "Consommation carburant",
      description: "Tous les pleins par véhicule avec litres, montant et relevé kilométrique.",
      icon: "fuel",
      category: t("reports.categories.fleet"),
      categoryTone: "info",
      headers: ["Date", "Véhicule", "Plaque", "Litres", "Montant (FCFA)", "KM compteur", "Type carburant", "Station"],
      rows: () => fuelEntries.map((f) => {
        const v = vehicles.find((vv) => vv.id === f.vehicleId);
        return [
          formatDate(f.date), v ? `${v.brand} ${v.model}` : "—",
          v?.plate ?? "—", f.liters, f.amount, f.kmReading, f.fuelType, f.station ?? "—",
        ];
      }),
      filename: `carburant_${TODAY_STR}.csv`,
    },
    {
      id: "oil-change",
      title: "Suivi des vidanges",
      description: "État des vidanges pour chaque véhicule avec alertes de dépassement.",
      icon: "wrench",
      category: t("reports.categories.fleet"),
      categoryTone: "info",
      headers: ["Immatriculation", "Marque", "Modèle", "KM actuel", "Dernière vidange", "KM à la vidange", "KM depuis vidange", "Jours depuis vidange", "Prochain KM", "Statut"],
      rows: () => vehicles.map((v) => {
        const daysSince = v.lastOilChange
          ? Math.round((Date.now() - new Date(v.lastOilChange).getTime()) / 86400000) : "—";
        const kmSince = v.kmAtLastOilChange != null ? v.currentKm - v.kmAtLastOilChange : "—";
        const st = oilChangeStatus(v);
        return [
          v.plate, v.brand, v.model, v.currentKm,
          v.lastOilChange ? formatDate(v.lastOilChange) : "—",
          v.kmAtLastOilChange ?? "—", kmSince, daysSince,
          v.kmAtLastOilChange ? v.kmAtLastOilChange + 5000 : "—",
          t(`vehicle.oilChange.${st}`),
        ];
      }),
      filename: `vidanges_${TODAY_STR}.csv`,
    },
    {
      id: "driver-sheets",
      title: "Fiches journalières chauffeurs",
      description: "Toutes les fiches avec ponctualité, acceptations et commentaires superviseur.",
      icon: "idcard",
      category: t("reports.categories.fleet"),
      categoryTone: "info",
      headers: ["Date", "Chauffeur", "Shift", "Véhicule", "Courses", "Acceptées", "Refusées", "Annulées", "Ponctualité /5", "Présentation /5", "Respect règles /5", "Retards", "Absences", "Incidents", "Commentaire"],
      rows: () => driverSheets.map((ds) => {
        const drv = drivers.find((d) => d.id === ds.driverId);
        const veh = vehicles.find((v) => v.id === ds.vehicleId);
        return [
          formatDate(ds.date), drv?.name ?? "—", t(`shift.${ds.shiftSlot}`), veh?.plate ?? "—",
          ds.trips, ds.accepted, ds.refused, ds.cancelled,
          ds.punctuality, ds.presentation, ds.rulesCompliance,
          ds.lateCount, ds.absences, ds.incidents,
          ds.supervisorComment ?? "—",
        ];
      }),
      filename: `fiches_chauffeurs_${TODAY_STR}.csv`,
    },
    {
      id: "compliance",
      title: "Rapport de conformité",
      description: "Documents expirants : assurances, cartes grises, permis de conduire.",
      icon: "shield",
      category: t("reports.categories.compliance"),
      categoryTone: "success",
      headers: ["Type", "Entité", "Document", "Date expiration", "Jours restants", "Statut"],
      rows: () => {
        const now = Date.now();
        const rows: (string | number)[][] = [];
        vehicles.forEach((v) => {
          const insD = Math.round((new Date(v.insuranceExpiry).getTime() - now) / 86400000);
          const regD = Math.round((new Date(v.registrationExpiry).getTime() - now) / 86400000);
          rows.push(["Véhicule", `${v.plate} · ${v.brand} ${v.model}`, "Assurance", formatDate(v.insuranceExpiry), insD, insD < 0 ? "EXPIRÉ" : insD < 60 ? "BIENTÔT" : "OK"]);
          rows.push(["Véhicule", `${v.plate} · ${v.brand} ${v.model}`, "Carte grise", formatDate(v.registrationExpiry), regD, regD < 0 ? "EXPIRÉ" : regD < 60 ? "BIENTÔT" : "OK"]);
        });
        drivers.forEach((d) => {
          const licD = Math.round((new Date(d.licenseExpiry).getTime() - now) / 86400000);
          rows.push(["Chauffeur", `${d.name} · ${d.employeeId}`, "Permis", formatDate(d.licenseExpiry), licD, licD < 0 ? "EXPIRÉ" : licD < 60 ? "BIENTÔT" : "OK"]);
        });
        return rows;
      },
      filename: `conformite_${TODAY_STR}.csv`,
    },
  ];

  const finance: ReportDef[] = [
    {
      id: "expenses",
      title: "Rapport financier / Dépenses",
      description: "Toutes les dépenses fournisseurs avec catégorie, département et statut de paiement.",
      icon: "money",
      category: t("reports.categories.finance"),
      categoryTone: "neutral",
      headers: ["Date", "Fournisseur", "Catégorie", "Département", "Montant (FCFA)", "Statut paiement"],
      rows: () => expenses.map((e) => [
        formatDate(e.date), e.supplierName, e.category, e.department,
        formatCurrency(e.amount), e.paymentStatus,
      ]),
      filename: `depenses_${TODAY_STR}.csv`,
    },
    {
      id: "zonal",
      title: "Analyse zonale",
      description: "Performance et revenus par zone de départ : taux de complétion, CA estimé.",
      icon: "chart",
      category: t("reports.categories.finance"),
      categoryTone: "neutral",
      headers: ["Zone", "Courses totales", "Complétées", "Annulées/Refusées", "Taux complétion", "Revenu (FCFA)", "Revenu moyen / course", "Incidents"],
      rows: () => zonalStats().map((z) => [
        z.zone, z.totalTrips, z.completed, z.cancelled,
        percent(z.completionRate), formatCurrency(z.revenue), formatCurrency(z.avgRevenue), z.incidents,
      ]),
      filename: `analyse_zonale_${TODAY_STR}.csv`,
    },
    {
      id: "profitability",
      title: "Synthèse de rentabilité",
      description: "KPIs financiers hebdomadaires : chiffre d'affaires, coûts et marge brute.",
      icon: "chart",
      category: t("reports.categories.finance"),
      categoryTone: "neutral",
      headers: ["Indicateur", "Valeur"],
      rows: () => {
        const kpi = weeklyRevenueTotals();
        return [
          ["Chiffre d'affaires (7 jours)", formatCurrency(kpi.revenue)],
          ["Coûts opérationnels (7 jours)", formatCurrency(kpi.cost)],
          ["Marge brute", formatCurrency(kpi.margin)],
          ["Taux de marge", percent(kpi.marginRate)],
          ["Revenu moyen par course", formatCurrency(kpi.revenuePerTrip)],
          ["Dépense carburant totale", formatCurrency(fuelEntries.reduce((s, f) => s + f.amount, 0))],
        ];
      },
      filename: `rentabilite_${TODAY_STR}.csv`,
    },
  ];

  const byRole: Record<Props["role"], ReportDef[]> = {
    ADMIN: [...dispatch, ...fleet, ...finance],
    DISPATCH_SUPERVISOR: [...dispatch],
    DISPATCH_AGENT: [dispatch[0], dispatch[2]],  // trips + incidents only
    FLEET_MANAGER: [...fleet, finance[0]],
  };

  return byRole[role] ?? [];
}

const CATEGORY_ORDER = ["Dispatch", "Flotte", "Fleet", "Finance", "Conformité", "Compliance", "Incidents"];

export default function ReportCenter({ role }: Props) {
  const { t } = useTranslation();
  const [preset, setPreset] = useState<DatePreset>("week");
  const [range, setRange]   = useState(() => getPresetRange("week"));
  const [loading, setLoading] = useState<string | null>(null);

  const reports = buildReports(role, t);

  const grouped = CATEGORY_ORDER.reduce<Record<string, ReportDef[]>>((acc, cat) => {
    const defs = reports.filter((r) => r.category === cat);
    if (defs.length) acc[cat] = defs;
    return acc;
  }, {});

  const handleGenerate = (rep: ReportDef) => {
    setLoading(rep.id);
    setTimeout(() => {
      try {
        const csv = generateCSV(rep.headers, rep.rows());
        downloadCSV(rep.filename, csv);
        toast.success(t("reports.generated"), { description: rep.filename });
      } catch {
        toast.error("Erreur lors de la génération");
      } finally {
        setLoading(null);
      }
    }, 700);
  };

  return (
    <div>
      <PageHeader
        title={t("reports.title")}
        subtitle={t("reports.subtitle")}
        actions={<Badge tone="neutral">{t(`role.${role}`)}</Badge>}
      />

      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-[12.5px] text-muted shrink-0">{t("reports.period")} :</span>
          <DateRangeFilter preset={preset} range={range} onChange={(p, r) => { setPreset(p); setRange(r); }} />
        </div>
      </Card>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, defs]) => (
          <div key={category}>
            <h2 className="text-[13px] font-semibold text-brand-500 uppercase tracking-widest mb-4">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {defs.map((rep) => (
                <ReportCard
                  key={rep.id}
                  rep={rep}
                  loading={loading === rep.id}
                  onGenerate={() => handleGenerate(rep)}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportCard({
  rep, loading, onGenerate, t,
}: {
  rep: ReportDef;
  loading: boolean;
  onGenerate: () => void;
  t: (k: string) => string;
}) {
  return (
    <div className={cn(
      "bg-white rounded-[14px] border border-[color:var(--color-border-soft)] p-5 flex flex-col gap-4 transition-shadow hover:shadow-sm",
      loading && "opacity-70",
    )}>
      <div className="flex items-start gap-3">
        <span className="h-10 w-10 rounded-[10px] bg-brand-50 text-brand-500 flex items-center justify-center shrink-0">
          <Icon name={rep.icon} size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-[14px] font-semibold text-ink leading-tight">{rep.title}</p>
            <Badge tone={rep.categoryTone}>{rep.category}</Badge>
          </div>
          <p className="text-[12.5px] text-muted leading-relaxed">{rep.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1 border-t border-[color:var(--color-border-soft)]">
        <span className="flex-1 text-[11.5px] text-muted">
          <Icon name="file" size={12} className="inline mr-1" />
          CSV · {rep.filename.split("_")[0]}
        </span>
        <Button
          size="sm"
          loading={loading}
          leftIcon={loading ? undefined : <Icon name="download" size={14} />}
          onClick={onGenerate}
        >
          {loading ? t("reports.generating") : t("reports.generate")}
        </Button>
      </div>
    </div>
  );
}
