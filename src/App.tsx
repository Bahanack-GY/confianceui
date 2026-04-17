import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, roleHome } from "./lib/auth";
import { AppShell } from "./components/layout/AppShell";
import { ProtectedRoute } from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import ExecutiveDashboard from "./pages/admin/ExecutiveDashboard";
import AdminReports from "./pages/admin/Reports";

import SupDashboard from "./pages/dispatch-supervisor/Dashboard";
import SupShiftReports from "./pages/dispatch-supervisor/ShiftReports";
import SupShiftReportForm from "./pages/dispatch-supervisor/ShiftReportForm";
import SupHandover from "./pages/dispatch-supervisor/Handover";
import SupIncidents from "./pages/dispatch-supervisor/Incidents";
import SupTrips from "./pages/dispatch-supervisor/Trips";
import SupReports from "./pages/dispatch-supervisor/Reports";

import AgentDashboard from "./pages/dispatch-agent/Dashboard";
import AgentShiftReports from "./pages/dispatch-agent/ShiftReports";
import AgentShiftReportForm from "./pages/dispatch-agent/ShiftReportForm";
import AgentIncidents from "./pages/dispatch-agent/Incidents";
import AgentTrips from "./pages/dispatch-agent/Trips";
import AgentReports from "./pages/dispatch-agent/Reports";

import FleetDashboard from "./pages/fleet/Dashboard";
import FleetVehicles from "./pages/fleet/Vehicles";
import FleetVehicleDetail from "./pages/fleet/VehicleDetail";
import FleetDrivers from "./pages/fleet/Drivers";
import FleetDriverDetail from "./pages/fleet/DriverDetail";
import FleetDriverSheets from "./pages/fleet/DriverSheets";
import FleetFuel from "./pages/fleet/Fuel";
import FleetChecklists from "./pages/fleet/Checklists";
import FleetIncidents from "./pages/fleet/Incidents";
import FleetCompliance from "./pages/fleet/Compliance";
import FleetReports from "./pages/fleet/Reports";

import ProcurementDashboard from "./pages/procurement/Dashboard";
import ProcurementRequests from "./pages/procurement/Requests";
import ProcurementSuppliers from "./pages/procurement/Suppliers";
import ProcurementServices from "./pages/procurement/Services";
import ProcurementExpenses from "./pages/procurement/Expenses";

import DriverDashboard from "./pages/driver/Dashboard";
import DriverChecklist from "./pages/driver/Checklist";
import DriverActivity from "./pages/driver/Activity";
import DriverIncidents from "./pages/driver/Incidents";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? roleHome(user.role) : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route path="/profile"  element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* ADMIN */}
        <Route path="/admin"                 element={<ProtectedRoute roles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/executive"       element={<ProtectedRoute roles={["ADMIN"]}><ExecutiveDashboard /></ProtectedRoute>} />
        <Route path="/admin/reports"         element={<ProtectedRoute roles={["ADMIN"]}><AdminReports /></ProtectedRoute>} />
        <Route path="/admin/users"           element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/shift-reports"   element={<ProtectedRoute roles={["ADMIN"]}><SupShiftReports /></ProtectedRoute>} />
        <Route path="/admin/incidents"       element={<ProtectedRoute roles={["ADMIN"]}><FleetIncidents /></ProtectedRoute>} />
        <Route path="/admin/trips"           element={<ProtectedRoute roles={["ADMIN"]}><SupTrips /></ProtectedRoute>} />
        <Route path="/admin/vehicles"        element={<ProtectedRoute roles={["ADMIN"]}><FleetVehicles /></ProtectedRoute>} />
        <Route path="/admin/drivers"         element={<ProtectedRoute roles={["ADMIN"]}><FleetDrivers /></ProtectedRoute>} />
        <Route path="/admin/fuel"            element={<ProtectedRoute roles={["ADMIN"]}><FleetFuel /></ProtectedRoute>} />
        <Route path="/admin/checklists"      element={<ProtectedRoute roles={["ADMIN"]}><FleetChecklists /></ProtectedRoute>} />
        <Route path="/admin/compliance"      element={<ProtectedRoute roles={["ADMIN"]}><FleetCompliance /></ProtectedRoute>} />

        {/* DISPATCH SUPERVISOR */}
        <Route path="/dispatch-supervisor"                   element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupDashboard /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/shift-reports"     element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupShiftReports /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/shift-reports/new" element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupShiftReportForm /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/handover"          element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupHandover /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/incidents"         element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupIncidents /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/trips"             element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupTrips /></ProtectedRoute>} />
        <Route path="/dispatch-supervisor/reports"           element={<ProtectedRoute roles={["DISPATCH_SUPERVISOR"]}><SupReports /></ProtectedRoute>} />

        {/* DISPATCH AGENT */}
        <Route path="/dispatch-agent"                   element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentDashboard /></ProtectedRoute>} />
        <Route path="/dispatch-agent/shift-reports"     element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentShiftReports /></ProtectedRoute>} />
        <Route path="/dispatch-agent/shift-reports/new" element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentShiftReportForm /></ProtectedRoute>} />
        <Route path="/dispatch-agent/incidents"         element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentIncidents /></ProtectedRoute>} />
        <Route path="/dispatch-agent/trips"             element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentTrips /></ProtectedRoute>} />
        <Route path="/dispatch-agent/reports"           element={<ProtectedRoute roles={["DISPATCH_AGENT"]}><AgentReports /></ProtectedRoute>} />

        {/* FLEET */}
        <Route path="/fleet"                 element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetDashboard /></ProtectedRoute>} />
        <Route path="/fleet/vehicles"        element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetVehicles /></ProtectedRoute>} />
        <Route path="/fleet/vehicles/:id"    element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetVehicleDetail /></ProtectedRoute>} />
        <Route path="/fleet/drivers"         element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetDrivers /></ProtectedRoute>} />
        <Route path="/fleet/drivers/:id"     element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetDriverDetail /></ProtectedRoute>} />
        <Route path="/fleet/driver-sheets"   element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetDriverSheets /></ProtectedRoute>} />
        <Route path="/fleet/fuel"            element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetFuel /></ProtectedRoute>} />
        <Route path="/fleet/checklists"      element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetChecklists /></ProtectedRoute>} />
        <Route path="/fleet/incidents"       element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetIncidents /></ProtectedRoute>} />
        <Route path="/fleet/compliance"      element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetCompliance /></ProtectedRoute>} />
        <Route path="/fleet/reports"         element={<ProtectedRoute roles={["FLEET_MANAGER"]}><FleetReports /></ProtectedRoute>} />

        {/* PROCUREMENT */}
        <Route path="/procurement"           element={<ProtectedRoute roles={["FLEET_MANAGER","ADMIN"]}><ProcurementDashboard /></ProtectedRoute>} />
        <Route path="/procurement/requests"  element={<ProtectedRoute roles={["FLEET_MANAGER","ADMIN"]}><ProcurementRequests /></ProtectedRoute>} />
        <Route path="/procurement/suppliers" element={<ProtectedRoute roles={["FLEET_MANAGER","ADMIN"]}><ProcurementSuppliers /></ProtectedRoute>} />
        <Route path="/procurement/services"  element={<ProtectedRoute roles={["FLEET_MANAGER","ADMIN"]}><ProcurementServices /></ProtectedRoute>} />
        <Route path="/procurement/expenses"  element={<ProtectedRoute roles={["FLEET_MANAGER","ADMIN"]}><ProcurementExpenses /></ProtectedRoute>} />

        {/* DRIVER */}
        <Route path="/driver"           element={<ProtectedRoute roles={["DRIVER"]}><DriverDashboard /></ProtectedRoute>} />
        <Route path="/driver/checklist" element={<ProtectedRoute roles={["DRIVER"]}><DriverChecklist /></ProtectedRoute>} />
        <Route path="/driver/activity"  element={<ProtectedRoute roles={["DRIVER"]}><DriverActivity /></ProtectedRoute>} />
        <Route path="/driver/incidents" element={<ProtectedRoute roles={["DRIVER"]}><DriverIncidents /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
