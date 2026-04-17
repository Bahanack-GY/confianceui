export type Role =
  | "ADMIN"
  | "DISPATCH_SUPERVISOR"
  | "DISPATCH_AGENT"
  | "FLEET_MANAGER"
  | "DRIVER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  department?: "DISPATCH" | "FLEET" | "ADMIN";
}

export type ShiftSlot = "MORNING" | "EVENING" | "NIGHT";

export interface Shift {
  id: string;
  slot: ShiftSlot;
  date: string;
  startAt: string;
  endAt: string;
}

export type TripStatus =
  | "PENDING"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUSED";

export interface Trip {
  id: string;
  clientName: string;
  pickup: string;
  dropoff: string;
  driverId?: string;
  vehicleId?: string;
  status: TripStatus;
  cancelReason?: string;
  refuseReason?: string;
  requestedAt: string;
  assignedAt?: string;
  completedAt?: string;
}

export interface Driver {
  id: string;
  employeeId: string;
  name: string;
  phone: string;
  email?: string;
  status: "ACTIVE" | "ON_LEAVE" | "SUSPENDED";
  hiredAt: string;
  licenseExpiry: string;
  rating: number;
  photoUrl?: string;
}

export type FuelType = "DIESEL" | "GASOLINE" | "HYBRID";

export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  fuelType: FuelType;
  condition: "new" | "used";
  initialKm: number;
  currentKm: number;
  status: "AVAILABLE" | "ON_TRIP" | "MAINTENANCE" | "OUT_OF_SERVICE";
  insuranceExpiry: string;
  registrationExpiry: string;
  assignedDriverId?: string;
}

export type IncidentType =
  | "ACCIDENT"
  | "ACCIDENT_MINOR"
  | "THEFT"
  | "FIRE"
  | "SECURITY"
  | "BREAKDOWN"
  | "CLIENT_CONFLICT"
  | "INAPPROPRIATE_BEHAVIOR"
  | "OTHER";

export type IncidentStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Incident {
  id: string;
  ref: string;
  reportedBy: string;
  service: "DISPATCH" | "FLEET";
  department: "DISPATCH" | "FLEET";
  date: string;
  time: string;
  location: string;
  tripId?: string;
  vehicleId?: string;
  plate?: string;
  driverId?: string;
  type: IncidentType;
  description: string;
  damages?: string;
  peopleInvolved?: string;
  consequences?: ("NONE" | "DELAY" | "MATERIAL" | "COMPLAINT")[];
  actionsTaken?: string;
  supervisorRecommendation?: "NONE" | "WARNING" | "SUSPENSION" | "OTHER";
  status: IncidentStatus;
}

export interface ShiftReport {
  id: string;
  reporterId: string;
  reporterRole: "DISPATCH_SUPERVISOR" | "DISPATCH_AGENT";
  supervisorName?: string;
  agents?: string[];
  shiftSlot: ShiftSlot;
  date: string;
  totalTrips: number;
  successTrips: number;
  cancelledTrips: number;
  cancelReasons?: string;
  refusedTrips: number;
  refuseReasons?: string;
  avgWaitTimeMin: number;
  avgAssignTimeMin: number;
  reassignments: number;
  cancelRate: number;
  successRate: number;
  ongoingTrips?: string;
  ongoingIncidents?: string;
  criticalZones?: string;
  driversFleetNotes?: string;
  priorities?: string;
  handoffNotes?: string;
}

export interface VehicleChecklist {
  id: string;
  vehicleId: string;
  driverId: string;
  date: string;
  bodyCondition: "OK" | "KO";
  bodyNotes?: string;
  tires: "OK" | "KO";
  tiresNotes?: string;
  levels: "OK" | "KO";
  levelsNotes?: string;
  lights: "OK" | "KO";
  lightsNotes?: string;
  cleanliness: "OK" | "KO";
  cleanlinessNotes?: string;
  documents: "OK" | "KO";
  documentsNotes?: string;
  kmStart: number;
}

export interface FuelEntry {
  id: string;
  date: string;
  vehicleId: string;
  liters: number;
  amount: number;
  kmReading: number;
  fuelType: FuelType;
  station?: string;
}

// ─── Procurement ────────────────────────────────────────────────────────────

export type RequestType = "purchase" | "service";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ServiceStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type PaymentStatus = "PENDING" | "PAID" | "PARTIAL";
export type SupplierStatus = "ACTIVE" | "TO_AVOID";
export type FiscalStatus = "COMPLIANT" | "NON_COMPLIANT" | "PENDING" | "UNKNOWN";

export interface PurchaseRequest {
  id: string;
  requester: string;
  department: string;
  type: RequestType;
  category: string;
  description: string;
  estimatedAmount: number;
  suggestedSupplier?: string;
  status: RequestStatus;
  createdAt: string;
  validatedBy?: string;
  validationNote?: string;
}

export interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  city: string;
  status: SupplierStatus;
  nui?: string;
  rccm?: string;
  fiscalStatus: FiscalStatus;
  fiscalAttestationExpiry?: string;
  cnpsStatus: FiscalStatus;
}

export interface ServiceTracking {
  id: string;
  requestId: string;
  supplierId: string;
  supplierName: string;
  description: string;
  status: ServiceStatus;
  startDate?: string;
  endDate?: string;
}

export interface Expense {
  id: string;
  supplierId: string;
  supplierName: string;
  amount: number;
  category: string;
  department: string;
  paymentStatus: PaymentStatus;
  date: string;
  requestId?: string;
}

// ─── Daily Driver Sheet ──────────────────────────────────────────────────────

export interface DailyDriverSheet {
  id: string;
  driverId: string;
  vehicleId: string;
  shiftSlot: ShiftSlot;
  date: string;
  trips: number;
  accepted: number;
  refused: number;
  cancelled: number;
  loginAt: string;
  breakAt?: string;
  logoutAt?: string;
  refuelAt?: string;
  punctuality: 1 | 2 | 3 | 4 | 5;
  presentation: 1 | 2 | 3 | 4 | 5;
  rulesCompliance: 1 | 2 | 3 | 4 | 5;
  clientFeedback?: string;
  driverFeedback?: string;
  lateCount: number;
  absences: number;
  incidents: number;
  supervisorComment?: string;
}
