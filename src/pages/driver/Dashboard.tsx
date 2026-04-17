import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatCard } from "../../components/ui/StatCard";
import { Icon } from "../../components/layout/Icon";
import { useAuth } from "../../lib/auth";
import { drivers, vehicles, trips, checklists } from "../../lib/mock-data";
import { formatDateTime } from "../../lib/utils";

export default function DriverDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const me = drivers.find((d) => d.email === user?.email) ?? drivers[0];
  const myVehicle = vehicles.find((v) => v.assignedDriverId === me.id);
  const myTrips = trips.filter((tr) => tr.driverId === me.id);
  const todaysChecklist = checklists.find((c) => c.driverId === me.id);
  const completed = myTrips.filter((tr) => tr.status === "COMPLETED").length;

  return (
    <div>
      <PageHeader
        title={`Bonjour, ${me.name.split(" ")[0]}`}
        subtitle={new Date().toLocaleDateString(undefined, { dateStyle: "full" })}
        actions={
          !todaysChecklist ? (
            <Link to="/driver/checklist">
              <Button leftIcon={<Icon name="check" size={16} />}>{t("checklist.submit")}</Button>
            </Link>
          ) : (
            <Badge tone="success">Check-list validée</Badge>
          )
        }
      />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard label="Courses totales"    value={myTrips.length} icon={<Icon name="route" size={22} />} />
        <StatCard label="Terminées"           value={completed} icon={<Icon name="check" size={22} />} />
        <StatCard label="Note moyenne"        value={me.rating.toFixed(1)} icon={<Icon name="star" size={22} />} />
        <StatCard label="Véhicule"            value={myVehicle?.plate ?? "—"} icon={<Icon name="car" size={22} />} footnote={myVehicle ? `${myVehicle.brand} ${myVehicle.model}` : undefined} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" padded={false}>
          <CardHeader className="px-5 pt-5" title="Mes dernières courses" />
          <ul className="divide-y divide-[color:var(--color-border-soft)]">
            {myTrips.slice(0, 5).map((tr) => (
              <li key={tr.id} className="px-5 py-3 flex items-center gap-4">
                <span className="h-9 w-9 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center"><Icon name="route" size={16} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-ink truncate">{tr.clientName} · {tr.pickup} → {tr.dropoff}</p>
                  <p className="text-[12px] text-[color:var(--color-muted)]">{formatDateTime(tr.requestedAt)}</p>
                </div>
                <Badge tone="brand">{t(`trip.status.${tr.status}`)}</Badge>
              </li>
            ))}
            {myTrips.length === 0 && <li className="py-6 text-center text-[color:var(--color-muted)]">Aucune course</li>}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Aujourd'hui" />
            <ul className="space-y-3 text-[13.5px]">
              <li className="flex items-center gap-3">
                <Icon name="check" size={16} className={todaysChecklist ? "text-success-500" : "text-[color:var(--color-muted-soft)]"} />
                <span className={todaysChecklist ? "text-ink-soft" : "text-[color:var(--color-muted)]"}>Check-list de début de shift</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="clock" size={16} className="text-brand-500" />
                <span>Shift : Matin · 06h — 14h</span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="car" size={16} className="text-brand-500" />
                <span>Véhicule : {myVehicle?.plate ?? "—"}</span>
              </li>
            </ul>
          </Card>

          <Card>
            <CardHeader title="Raccourcis" />
            <div className="grid gap-2">
              <Link to="/driver/checklist"><Button variant="outline" fullWidth leftIcon={<Icon name="checklist" size={16} />}>{t("nav.myChecklist")}</Button></Link>
              <Link to="/driver/activity"><Button variant="outline" fullWidth leftIcon={<Icon name="chart" size={16} />}>{t("nav.myActivity")}</Button></Link>
              <Link to="/driver/incidents"><Button variant="outline" fullWidth leftIcon={<Icon name="alert" size={16} />}>{t("nav.reportIncident")}</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
