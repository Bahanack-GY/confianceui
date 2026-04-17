import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Section } from "../../components/ui/Section";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/layout/Icon";
import { trips, incidents, vehicles, drivers } from "../../lib/mock-data";
import { formatDateTime } from "../../lib/utils";

export default function Handover() {
  const { t } = useTranslation();
  const ongoing = trips.filter((tr) => tr.status === "IN_PROGRESS" || tr.status === "ASSIGNED");
  const openIncidents = incidents.filter((i) => i.status !== "CLOSED");

  return (
    <div>
      <PageHeader
        title={t("nav.handover")}
        subtitle="Passation de service"
        actions={
          <>
            <Button variant="outline" leftIcon={<Icon name="download" size={16} />}>{t("common.export")}</Button>
            <Button leftIcon={<Icon name="check" size={16} />}>Valider la passation</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="Courses en cours">
            <Card padded={false}>
              <ul className="divide-y divide-[color:var(--color-border-soft)]">
                {ongoing.map((tr) => (
                  <li key={tr.id} className="p-4 flex items-center gap-4">
                    <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center"><Icon name="route" size={16} /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-ink truncate">
                        {tr.clientName} · {tr.pickup} → {tr.dropoff}
                      </p>
                      <p className="text-[12px] text-[color:var(--color-muted)]">
                        {drivers.find((d) => d.id === tr.driverId)?.name ?? "—"} ·{" "}
                        {vehicles.find((v) => v.id === tr.vehicleId)?.plate ?? "—"} · {formatDateTime(tr.requestedAt)}
                      </p>
                    </div>
                    <Badge tone={tr.status === "IN_PROGRESS" ? "brand" : "info"}>{t(`trip.status.${tr.status}`)}</Badge>
                  </li>
                ))}
                {ongoing.length === 0 && <li className="p-6 text-center text-[color:var(--color-muted)]">Aucune course en cours</li>}
              </ul>
            </Card>
          </Section>

          <Section title="Incidents en cours">
            <Card padded={false}>
              <ul className="divide-y divide-[color:var(--color-border-soft)]">
                {openIncidents.map((i) => (
                  <li key={i.id} className="p-4 flex items-center gap-4">
                    <span className="h-9 w-9 rounded-full bg-[#fbe9e9] text-danger-500 flex items-center justify-center"><Icon name="alert" size={16} /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-medium text-ink truncate">
                        #{i.ref} · {t(`incident.type.${i.type}`)} · {i.location}
                      </p>
                      <p className="text-[12px] text-[color:var(--color-muted)] line-clamp-1">{i.description}</p>
                    </div>
                    <Badge tone="warning">{t(`incident.status.${i.status}`)}</Badge>
                  </li>
                ))}
                {openIncidents.length === 0 && <li className="p-6 text-center text-[color:var(--color-muted)]">Aucun incident ouvert</li>}
              </ul>
            </Card>
          </Section>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Zones critiques" />
            <ul className="space-y-2 text-[13.5px]">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning-500" /> Tsinga (soirée)</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-warning-500" /> Mvog-Mbi (sortie école)</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-danger-500" /> Nlongkak (affluence élevée)</li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Chauffeurs & flotte" />
            <ul className="space-y-3">
              {drivers.slice(0, 4).map((d) => (
                <li key={d.id} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-soft">{d.name}</span>
                  <Badge tone={d.status === "ACTIVE" ? "success" : d.status === "ON_LEAVE" ? "warning" : "danger"}>{t(`driver.status.${d.status}`)}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="Priorités opérationnelles" />
            <p className="text-[13px] text-ink-soft leading-relaxed">
              Couvrir la sortie de l'école américaine à 16h. Maintenir 2 véhicules en standby Bastos.
              Vérifier affectations 16h–18h.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
