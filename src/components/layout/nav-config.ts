import type { Role } from "../../types";

export interface NavItem {
  to: string;
  label: string;
  iconKey: string;
}

export interface NavSection {
  label?: string;
  items: NavItem[];
}

export type ModuleKey = "fleet" | "procurement";

export interface AppModule {
  key: ModuleKey;
  label: string;
  iconKey: string;
  sections: NavSection[];
}

const FLEET_SECTIONS: NavSection[] = [
  {
    items: [
      { to: "/fleet",               label: "nav.dashboard",    iconKey: "dashboard" },
      { to: "/fleet/vehicles",      label: "nav.vehicles",     iconKey: "car" },
      { to: "/fleet/drivers",       label: "nav.drivers",      iconKey: "idcard" },
      { to: "/fleet/driver-sheets", label: "nav.driverSheets", iconKey: "clipboard" },
      { to: "/fleet/fuel",          label: "nav.fuel",         iconKey: "fuel" },
      { to: "/fleet/checklists",    label: "nav.checklists",   iconKey: "checklist" },
      { to: "/fleet/incidents",     label: "nav.incidents",    iconKey: "alert" },
      { to: "/fleet/compliance",    label: "nav.compliance",   iconKey: "shield" },
    ],
  },
];

const PROCUREMENT_SECTIONS: NavSection[] = [
  {
    items: [
      { to: "/procurement",           label: "nav.procDashboard", iconKey: "dashboard" },
      { to: "/procurement/requests",  label: "nav.procRequests",  iconKey: "cart" },
      { to: "/procurement/suppliers", label: "nav.procSuppliers", iconKey: "store" },
      { to: "/procurement/services",  label: "nav.procServices",  iconKey: "box" },
      { to: "/procurement/expenses",  label: "nav.procExpenses",  iconKey: "money" },
    ],
  },
];

export const MODULES_BY_ROLE: Partial<Record<Role, AppModule[]>> = {
  FLEET_MANAGER: [
    { key: "fleet",       label: "Gestion Flotte", iconKey: "car",  sections: FLEET_SECTIONS },
    { key: "procurement", label: "Achats",          iconKey: "cart", sections: PROCUREMENT_SECTIONS },
  ],
  ADMIN: [
    { key: "fleet",       label: "Gestion Flotte", iconKey: "car",  sections: FLEET_SECTIONS },
    { key: "procurement", label: "Achats",          iconKey: "cart", sections: PROCUREMENT_SECTIONS },
  ],
};

export const NAV_BY_ROLE: Record<Role, NavSection[]> = {
  ADMIN: [
    {
      items: [
        { to: "/admin",               label: "nav.dashboard",    iconKey: "dashboard" },
        { to: "/admin/users",         label: "nav.users",        iconKey: "users" },
      ],
    },
    {
      label: "Dispatch",
      items: [
        { to: "/admin/shift-reports", label: "nav.shiftReports", iconKey: "clipboard" },
        { to: "/admin/incidents",     label: "nav.incidents",    iconKey: "alert" },
        { to: "/admin/trips",         label: "nav.trips",        iconKey: "route" },
      ],
    },
    {
      label: "Fleet",
      items: [
        { to: "/admin/vehicles",      label: "nav.vehicles",     iconKey: "car" },
        { to: "/admin/drivers",       label: "nav.drivers",      iconKey: "idcard" },
        { to: "/admin/fuel",          label: "nav.fuel",         iconKey: "fuel" },
        { to: "/admin/checklists",    label: "nav.checklists",   iconKey: "checklist" },
        { to: "/admin/compliance",    label: "nav.compliance",   iconKey: "shield" },
      ],
    },
  ],
  DISPATCH_SUPERVISOR: [
    {
      items: [
        { to: "/dispatch-supervisor",                 label: "nav.dashboard",    iconKey: "dashboard" },
        { to: "/dispatch-supervisor/shift-reports",   label: "nav.shiftReports", iconKey: "clipboard" },
        { to: "/dispatch-supervisor/handover",        label: "nav.handover",     iconKey: "handover" },
        { to: "/dispatch-supervisor/incidents",       label: "nav.incidents",    iconKey: "alert" },
        { to: "/dispatch-supervisor/trips",           label: "nav.trips",        iconKey: "route" },
      ],
    },
  ],
  DISPATCH_AGENT: [
    {
      items: [
        { to: "/dispatch-agent",                 label: "nav.dashboard",      iconKey: "dashboard" },
        { to: "/dispatch-agent/shift-reports",   label: "nav.shiftReports",   iconKey: "clipboard" },
        { to: "/dispatch-agent/incidents",       label: "nav.reportIncident", iconKey: "alert" },
        { to: "/dispatch-agent/trips",           label: "nav.trips",          iconKey: "route" },
      ],
    },
  ],
  FLEET_MANAGER: [
    {
      items: [
        { to: "/fleet",               label: "nav.dashboard",    iconKey: "dashboard" },
        { to: "/fleet/vehicles",      label: "nav.vehicles",     iconKey: "car" },
        { to: "/fleet/drivers",       label: "nav.drivers",      iconKey: "idcard" },
        { to: "/fleet/driver-sheets", label: "nav.driverSheets", iconKey: "clipboard" },
        { to: "/fleet/fuel",          label: "nav.fuel",         iconKey: "fuel" },
        { to: "/fleet/checklists",    label: "nav.checklists",   iconKey: "checklist" },
        { to: "/fleet/incidents",     label: "nav.incidents",    iconKey: "alert" },
        { to: "/fleet/compliance",    label: "nav.compliance",   iconKey: "shield" },
      ],
    },
  ],
  DRIVER: [
    {
      items: [
        { to: "/driver",           label: "nav.dashboard",      iconKey: "dashboard" },
        { to: "/driver/checklist", label: "nav.myChecklist",    iconKey: "checklist" },
        { to: "/driver/activity",  label: "nav.myActivity",     iconKey: "chart" },
        { to: "/driver/incidents", label: "nav.reportIncident", iconKey: "alert" },
      ],
    },
  ],
};
