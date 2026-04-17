import DispatchDashboard from "../_shared/DispatchDashboard";
export default function Page() {
  return <DispatchDashboard newReportPath="/dispatch-agent/shift-reports/new" reportIncidentPath="/dispatch-agent/incidents" />;
}
