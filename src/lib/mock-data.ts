import type { Driver, Expense, FuelEntry, Incident, PurchaseRequest, ServiceTracking, ShiftReport, Supplier, Trip, Vehicle, VehicleChecklist, DailyDriverSheet } from "../types";

export const drivers: Driver[] = [
  { id: "d-01", employeeId: "DRV-001", name: "Jean Dibango", phone: "+237 699 10 01 01", status: "ACTIVE",    hiredAt: "2024-03-12", licenseExpiry: "2027-03-12", rating: 4.8 },
  { id: "d-02", employeeId: "DRV-002", name: "Marc Lontsi",  phone: "+237 699 10 01 02", status: "ACTIVE",    hiredAt: "2023-10-01", licenseExpiry: "2026-09-12", rating: 4.6 },
  { id: "d-03", employeeId: "DRV-003", name: "Sophie Ragon", phone: "+237 699 10 01 03", status: "ACTIVE",    hiredAt: "2025-01-15", licenseExpiry: "2028-01-15", rating: 4.9 },
  { id: "d-04", employeeId: "DRV-004", name: "Paul Etame",   phone: "+237 699 10 01 04", status: "ON_LEAVE",  hiredAt: "2022-06-22", licenseExpiry: "2026-06-22", rating: 4.5 },
  { id: "d-05", employeeId: "DRV-005", name: "Didier Kom",   phone: "+237 699 10 01 05", status: "ACTIVE",    hiredAt: "2024-09-09", licenseExpiry: "2027-09-09", rating: 4.7 },
  { id: "d-06", employeeId: "DRV-006", name: "Aline Meka",   phone: "+237 699 10 01 06", status: "SUSPENDED", hiredAt: "2023-04-04", licenseExpiry: "2026-04-04", rating: 3.9 },
];

export const vehicles: Vehicle[] = [
  { id: "v-01", plate: "CE-001-AB", brand: "Mercedes", model: "E-Class",     year: 2023, fuelType: "DIESEL",   condition: "new",  initialKm: 0,     currentKm: 48210,  status: "AVAILABLE",      insuranceExpiry: "2026-11-01", registrationExpiry: "2027-02-14", assignedDriverId: "d-01" },
  { id: "v-02", plate: "CE-002-AB", brand: "Toyota",   model: "Land Cruiser", year: 2022, fuelType: "DIESEL",   condition: "used", initialKm: 31000, currentKm: 92140,  status: "ON_TRIP",        insuranceExpiry: "2026-05-20", registrationExpiry: "2026-12-10", assignedDriverId: "d-02" },
  { id: "v-03", plate: "CE-003-AB", brand: "BMW",      model: "5 Series",    year: 2024, fuelType: "GASOLINE", condition: "new",  initialKm: 0,     currentKm: 18780,  status: "AVAILABLE",      insuranceExpiry: "2026-08-15", registrationExpiry: "2028-01-30", assignedDriverId: "d-03" },
  { id: "v-04", plate: "CE-004-AB", brand: "Audi",     model: "A6",          year: 2021, fuelType: "HYBRID",   condition: "used", initialKm: 54200, currentKm: 104500, status: "MAINTENANCE",    insuranceExpiry: "2026-04-30", registrationExpiry: "2026-07-01" },
  { id: "v-05", plate: "CE-005-AB", brand: "Lexus",    model: "ES",          year: 2023, fuelType: "HYBRID",   condition: "new",  initialKm: 0,     currentKm: 35120,  status: "AVAILABLE",      insuranceExpiry: "2027-01-11", registrationExpiry: "2027-06-22", assignedDriverId: "d-05" },
  { id: "v-06", plate: "CE-006-AB", brand: "Toyota",   model: "Camry",       year: 2020, fuelType: "GASOLINE", condition: "used", initialKm: 78500, currentKm: 142980, status: "OUT_OF_SERVICE", insuranceExpiry: "2026-03-01", registrationExpiry: "2026-05-15" },
];

const today = new Date();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const trips: Trip[] = Array.from({ length: 24 }).map((_, i) => {
  const statuses: Trip["status"][] = ["COMPLETED","COMPLETED","COMPLETED","IN_PROGRESS","ASSIGNED","CANCELLED","REFUSED","PENDING"];
  const status = statuses[i % statuses.length];
  return {
    id: `T-${1000 + i}`,
    clientName: ["Ambassade USA","J. Kouam","L. Abega","Residence Bastos","M. Ngono","Embassy UK","P. Tchoumi","Hôtel Hilton"][i % 8],
    pickup: ["Bastos","Omnisports","Nlongkak","Tsinga","Essos","Mvog-Mbi","Nkolbisson","Ekounou"][i % 8],
    dropoff: ["Aéroport","Centre-ville","Bastos","Mvan","Ngousso","Biyem-Assi","Warda","Etoudi"][i % 8],
    driverId: drivers[i % drivers.length].id,
    vehicleId: vehicles[i % vehicles.length].id,
    status,
    cancelReason: status === "CANCELLED" ? ["Client absent","Changement d'avis","Véhicule indisponible"][i % 3] : undefined,
    refuseReason: status === "REFUSED" ? ["Zone éloignée","Chauffeur occupé","Véhicule en maintenance"][i % 3] : undefined,
    requestedAt: new Date(Date.now() - i * 3600_000).toISOString(),
  };
});

export const incidents: Incident[] = [
  { id: "i-01", ref: "2026-01", reportedBy: "Paul Mbala",   service: "DISPATCH", department: "DISPATCH", date: daysAgo(10), time: "09:15", location: "Bastos",   tripId: "T-1003", vehicleId: "v-02", plate: "CE-002-AB", driverId: "d-02", type: "BREAKDOWN",        description: "Batterie HS",                     damages: "Aucun",                   actionsTaken: "Remorquage + remplacement",    status: "CLOSED",      supervisorRecommendation: "NONE" },
  { id: "i-02", ref: "2026-02", reportedBy: "Marie Nguemo", service: "DISPATCH", department: "FLEET",    date: daysAgo(9),  time: "14:40", location: "Omnisports",tripId: "T-1007", vehicleId: "v-04", plate: "CE-004-AB", driverId: "d-04", type: "ACCIDENT_MINOR",   description: "Choc arrière (non responsable)",  damages: "Pare-choc endommagé",     actionsTaken: "Constat envoyé à l'assurance", status: "IN_PROGRESS", supervisorRecommendation: "NONE" },
  { id: "i-03", ref: "2026-03", reportedBy: "Joseph Fotso", service: "FLEET",    department: "FLEET",    date: daysAgo(7),  time: "19:05", location: "Nlongkak", tripId: "T-1012", vehicleId: "v-05", plate: "CE-005-AB", driverId: "d-05", type: "CLIENT_CONFLICT", description: "Litige sur le paiement",          damages: "Aucun",                   actionsTaken: "Signalement + remboursement",  status: "CLOSED",      supervisorRecommendation: "WARNING" },
  { id: "i-04", ref: "2026-04", reportedBy: "Paul Mbala",   service: "DISPATCH", department: "DISPATCH", date: daysAgo(4),  time: "22:30", location: "Tsinga",   tripId: "T-1019", vehicleId: "v-01", plate: "CE-001-AB", driverId: "d-01", type: "SECURITY",         description: "Tentative d'agression évitée",     damages: "Aucun",                   actionsTaken: "Signalement police",           status: "OPEN",        supervisorRecommendation: "NONE" },
  { id: "i-05", ref: "2026-05", reportedBy: "Joseph Fotso", service: "FLEET",    department: "FLEET",    date: daysAgo(2),  time: "07:45", location: "Mvan",     tripId: "T-1022", vehicleId: "v-03", plate: "CE-003-AB", driverId: "d-03", type: "INAPPROPRIATE_BEHAVIOR", description: "Retard répété du chauffeur",  damages: "Aucun",                   actionsTaken: "Entretien RH programmé",        status: "IN_PROGRESS", supervisorRecommendation: "WARNING" },
];

export const shiftReports: ShiftReport[] = [
  {
    id: "sr-01", reporterId: "u-sup", reporterRole: "DISPATCH_SUPERVISOR",
    supervisorName: "Paul Mbala", agents: ["Marie Nguemo", "Clément Ondoa"],
    shiftSlot: "MORNING", date: daysAgo(1),
    totalTrips: 42, successTrips: 37, cancelledTrips: 3, refusedTrips: 2,
    cancelReasons: "Client absent (2), zone éloignée (1)",
    refuseReasons: "Véhicule indisponible (2)",
    avgWaitTimeMin: 6.4, avgAssignTimeMin: 2.1, reassignments: 4,
    cancelRate: 0.071, successRate: 0.881,
    ongoingTrips: "2 courses en direction aéroport",
    ongoingIncidents: "Incident 2026-04 en suivi",
    criticalZones: "Tsinga en soirée",
    driversFleetNotes: "V-04 en maintenance jusqu'à demain",
    priorities: "Couvrir la sortie de l'école américaine à 16h",
    handoffNotes: "Vérifier affectations 16h-18h. Maintenir 2 véhicules en standby Bastos.",
  },
];

export const fuelEntries: FuelEntry[] = [
  { id: "f-01", date: daysAgo(1),  vehicleId: "v-01", liters: 55, amount: 44000, kmReading: 48200, fuelType: "DIESEL",   station: "Total Bastos" },
  { id: "f-02", date: daysAgo(2),  vehicleId: "v-02", liters: 60, amount: 48000, kmReading: 92100, fuelType: "DIESEL",   station: "TotalEnergies Omnisports" },
  { id: "f-03", date: daysAgo(3),  vehicleId: "v-03", liters: 48, amount: 42240, kmReading: 18700, fuelType: "GASOLINE", station: "Tradex Nlongkak" },
  { id: "f-04", date: daysAgo(4),  vehicleId: "v-05", liters: 40, amount: 35200, kmReading: 35050, fuelType: "HYBRID",   station: "Total Bastos" },
  { id: "f-05", date: daysAgo(6),  vehicleId: "v-01", liters: 52, amount: 41600, kmReading: 47800, fuelType: "DIESEL",   station: "Total Bastos" },
  { id: "f-06", date: daysAgo(8),  vehicleId: "v-02", liters: 58, amount: 46400, kmReading: 91500, fuelType: "DIESEL",   station: "TotalEnergies Omnisports" },
];

export const checklists: VehicleChecklist[] = [
  { id: "c-01", vehicleId: "v-01", driverId: "d-01", date: daysAgo(0), bodyCondition: "OK", tires: "OK", levels: "OK", lights: "OK", cleanliness: "OK", documents: "OK", kmStart: 48210 },
  { id: "c-02", vehicleId: "v-03", driverId: "d-03", date: daysAgo(0), bodyCondition: "OK", tires: "KO", tiresNotes: "Pression AR droit 1.8", levels: "OK", lights: "OK", cleanliness: "OK", documents: "OK", kmStart: 18780 },
];

export const driverSheets: DailyDriverSheet[] = [
  { id: "ds-01", driverId: "d-01", vehicleId: "v-01", shiftSlot: "MORNING", date: daysAgo(1), trips: 12, accepted: 11, refused: 1, cancelled: 0, loginAt: "06:00", breakAt: "11:30", logoutAt: "14:00", refuelAt: "10:15", punctuality: 5, presentation: 5, rulesCompliance: 5, lateCount: 0, absences: 0, incidents: 0, supervisorComment: "RAS" },
  { id: "ds-02", driverId: "d-02", vehicleId: "v-02", shiftSlot: "EVENING", date: daysAgo(1), trips: 9,  accepted: 8,  refused: 0, cancelled: 1, loginAt: "14:00", breakAt: "18:00", logoutAt: "22:00", punctuality: 4, presentation: 5, rulesCompliance: 4, lateCount: 1, absences: 0, incidents: 1, supervisorComment: "Incident mineur géré" },
];

export function kpiSeriesTrips() {
  return Array.from({ length: 7 }).map((_, i) => ({
    day: ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"][i],
    completed: 28 + ((i * 7) % 15),
    cancelled: 2 + (i % 4),
    refused:   1 + ((i + 1) % 3),
  }));
}

export function cancelReasonShares() {
  return [
    { label: "Client absent",     value: 42 },
    { label: "Changement d'avis", value: 21 },
    { label: "Véhicule indispo",  value: 14 },
    { label: "Zone éloignée",     value: 9  },
    { label: "Autre",             value: 14 },
  ];
}

export function incidentsByType() {
  return [
    { label: "Panne",            value: 6 },
    { label: "Accident mineur",  value: 4 },
    { label: "Conflit client",   value: 3 },
    { label: "Sécurité",         value: 1 },
    { label: "Comportement",     value: 2 },
  ];
}

// ─── Procurement mock data ────────────────────────────────────────────────────

export const suppliers: Supplier[] = [
  { id: "sup-01", name: "Auto Pièces Cameroun", category: "Pièces auto",        contact: "+237 699 22 11 00", city: "Yaoundé", status: "ACTIVE",   nui: "M081300015869H", rccm: "RC/YAO/2018/B/0412", fiscalStatus: "COMPLIANT",     fiscalAttestationExpiry: "2026-12-31", cnpsStatus: "COMPLIANT" },
  { id: "sup-02", name: "Garage Central",        category: "Mécanique",          contact: "+237 677 55 44 33", city: "Yaoundé", status: "ACTIVE",   nui: "M074500021133A", rccm: "RC/YAO/2015/B/1023", fiscalStatus: "COMPLIANT",     fiscalAttestationExpiry: "2026-05-15", cnpsStatus: "COMPLIANT" },
  { id: "sup-03", name: "Office Pro",            category: "Fournitures bureau",  contact: "+237 699 10 22 33", city: "Douala",  status: "ACTIVE",   nui: "P066700044221B", rccm: "RC/DLA/2020/B/2208", fiscalStatus: "NON_COMPLIANT", fiscalAttestationExpiry: "2025-10-01", cnpsStatus: "NON_COMPLIANT" },
  { id: "sup-04", name: "Imprimerie Top",        category: "Impression",          contact: "+237 655 44 33 22", city: "Yaoundé", status: "TO_AVOID", nui: "M082100009874C", rccm: "RC/YAO/2021/B/0877", fiscalStatus: "NON_COMPLIANT", fiscalAttestationExpiry: "2025-06-30", cnpsStatus: "UNKNOWN" },
  { id: "sup-05", name: "Carburant Express",     category: "Carburant",           contact: "+237 699 88 77 66", city: "Yaoundé", status: "ACTIVE",   nui: "M083400056612D", rccm: "RC/YAO/2016/B/0654", fiscalStatus: "PENDING",       fiscalAttestationExpiry: undefined,   cnpsStatus: "COMPLIANT" },
  { id: "sup-06", name: "IT Solutions CM",       category: "Informatique",        contact: "+237 677 33 22 11", city: "Douala",  status: "ACTIVE",   nui: "P067900031100F", rccm: "RC/DLA/2019/B/1567", fiscalStatus: "COMPLIANT",     fiscalAttestationExpiry: "2026-06-01", cnpsStatus: "COMPLIANT" },
];

export const purchaseRequests: PurchaseRequest[] = [
  { id: "req-01", requester: "Jean Dibango",   department: "Flotte",    type: "purchase", category: "Pièces auto",       description: "Remplacement des pneus avant CE-004-AB",              estimatedAmount: 180000, suggestedSupplier: "sup-01", status: "APPROVED", createdAt: daysAgo(14), validatedBy: "Admin",  validationNote: "Urgent - véhicule immobilisé" },
  { id: "req-02", requester: "Marie Nguemo",   department: "Admin",     type: "purchase", category: "Fournitures bureau", description: "Ramettes A4 x20 + cartouches imprimante",              estimatedAmount: 45000,  suggestedSupplier: "sup-03", status: "APPROVED", createdAt: daysAgo(10), validatedBy: "Admin" },
  { id: "req-03", requester: "Joseph Fotso",   department: "Flotte",    type: "service",  category: "Mécanique",         description: "Vidange + contrôle technique CE-002-AB",               estimatedAmount: 95000,  suggestedSupplier: "sup-02", status: "PENDING",  createdAt: daysAgo(5) },
  { id: "req-04", requester: "Marie Nguemo",   department: "IT",        type: "purchase", category: "Informatique",       description: "2 disques durs externes 1TB pour sauvegarde",          estimatedAmount: 75000,  suggestedSupplier: "sup-06", status: "PENDING",  createdAt: daysAgo(3) },
  { id: "req-05", requester: "Paul Etame",     department: "Marketing", type: "service",  category: "Impression",         description: "500 flyers A5 pour campagne promotionnelle",           estimatedAmount: 30000,  suggestedSupplier: "sup-04", status: "REJECTED", createdAt: daysAgo(7),  validatedBy: "Admin",  validationNote: "Fournisseur à éviter - qualité insuffisante" },
  { id: "req-06", requester: "Jean Dibango",   department: "Flotte",    type: "purchase", category: "Carburant",          description: "Approvisionnement mensuel diesel 500L",                estimatedAmount: 350000, suggestedSupplier: "sup-05", status: "APPROVED", createdAt: daysAgo(2),  validatedBy: "Admin" },
];

export const serviceTrackings: ServiceTracking[] = [
  { id: "svc-01", requestId: "req-01", supplierId: "sup-01", supplierName: "Auto Pièces Cameroun", description: "Remplacement pneus avant CE-004-AB",      status: "DONE",        startDate: daysAgo(12), endDate: daysAgo(10) },
  { id: "svc-02", requestId: "req-02", supplierId: "sup-03", supplierName: "Office Pro",            description: "Livraison fournitures bureau",            status: "DONE",        startDate: daysAgo(8),  endDate: daysAgo(7) },
  { id: "svc-03", requestId: "req-03", supplierId: "sup-02", supplierName: "Garage Central",        description: "Vidange + contrôle technique CE-002-AB",  status: "IN_PROGRESS", startDate: daysAgo(1) },
  { id: "svc-04", requestId: "req-06", supplierId: "sup-05", supplierName: "Carburant Express",     description: "Livraison carburant diesel 500L",         status: "PENDING" },
];

export const expenses: Expense[] = [
  { id: "exp-01", supplierId: "sup-01", supplierName: "Auto Pièces Cameroun", amount: 175000, category: "Pièces auto",       department: "Flotte",    paymentStatus: "PAID",    date: daysAgo(10), requestId: "req-01" },
  { id: "exp-02", supplierId: "sup-03", supplierName: "Office Pro",            amount: 43500,  category: "Fournitures bureau", department: "Admin",     paymentStatus: "PAID",    date: daysAgo(7),  requestId: "req-02" },
  { id: "exp-03", supplierId: "sup-02", supplierName: "Garage Central",        amount: 95000,  category: "Mécanique",         department: "Flotte",    paymentStatus: "PENDING", date: daysAgo(1),  requestId: "req-03" },
  { id: "exp-04", supplierId: "sup-05", supplierName: "Carburant Express",     amount: 350000, category: "Carburant",          department: "Flotte",    paymentStatus: "PENDING", date: daysAgo(2),  requestId: "req-06" },
  { id: "exp-05", supplierId: "sup-06", supplierName: "IT Solutions CM",       amount: 72000,  category: "Informatique",       department: "IT",        paymentStatus: "PARTIAL", date: daysAgo(3),  requestId: "req-04" },
];

export function expensesByCategory() {
  const map: Record<string, number> = {};
  expenses.forEach((e) => { map[e.category] = (map[e.category] ?? 0) + e.amount; });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}

export function expensesByDepartment() {
  const map: Record<string, number> = {};
  expenses.forEach((e) => { map[e.department] = (map[e.department] ?? 0) + e.amount; });
  return Object.entries(map).map(([label, value]) => ({ label, value }));
}

// ─── Chart helpers ────────────────────────────────────────────────────────────

export function fuelByVehicleSeries() {
  return vehicles.slice(0, 5).map((v) => {
    const total = fuelEntries.filter((f) => f.vehicleId === v.id).reduce((s, f) => s + f.liters, 0);
    return { label: v.plate, value: total || Math.round(30 + Math.random() * 40) };
  });
}
