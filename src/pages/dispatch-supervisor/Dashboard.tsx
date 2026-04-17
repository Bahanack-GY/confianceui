import DispatchDashboard from "../_shared/DispatchDashboard";
export default function Page() {
  return <DispatchDashboard newReportPath="/dispatch-supervisor/shift-reports/new" reportIncidentPath="/dispatch-supervisor/incidents" />;
}
