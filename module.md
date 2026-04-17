# Implemented Features — Confiance Mobilité UI

> Last updated: 2026-04-16

---

## 🔐 Authentication

- Role-based login form (email + password)
- Auto-redirect to role-specific home after login
- Protected routes with role guard (per-page `roles[]` enforcement)
- User profile page (name, email, role badge)
- App settings page

---

## 📊 Admin Dashboard

- KPI cards: total trips, success rate, open incidents, fuel spend, fleet availability, active drivers, avg wait time, expiring documents
- Line chart: trips over time (completed / cancelled / refused)
- Donut chart: incidents by type
- Bar chart: fuel consumption per vehicle
- Recent activity feed (shift validation, incidents, fuel fills, maintenance events)

---

## 👥 User Management *(Admin only)*

- List all users with avatar, name, email, phone, role, and status
- Search users by name / email / phone
- Filter by role
- Create new user modal: name, email, phone, role, password
- Edit and delete actions per row

---

## 📋 Shift Reports *(Dispatch Supervisor & Agent)*

**Report List**
- Tabular list of all shift reports with date, shift slot, and status

**New Shift Report Form** (role-adaptive)
- General section: supervisor name, shift period (Morning / Evening / Night), agent list, date
- Operations section: total trips, successful trips, cancelled trips with reasons, refused trips with reasons
- Performance section: avg wait time, avg assignment time, reassignment count, auto-calculated cancel rate & success rate
- Handover section *(Supervisor only)*: ongoing trips, ongoing incidents, critical zones, driver/fleet status, priorities
- Handover notes *(Supervisor only)*: free-text shift transition instructions
- Sticky submit bar at the bottom

---

## 🔄 Shift Handover *(Dispatch Supervisor only)*

- Live feed of ongoing trips (driver, vehicle plate, pickup → dropoff, status badge)
- Live feed of open incidents (ref, type, location, description, status)
- Critical zones panel (static per-shift list)
- Drivers & fleet availability panel
- Operational priorities panel
- Export to file button
- Validate handover button

---

## 🚨 Incident Management *(All roles)*

**Incident Matrix (read + create)**
- Filterable table: search by ref / plate / location, filter by status (Open / In Progress / Closed), filter by type
- 9 incident types: Accident, Minor Accident, Theft, Fire, Security, Breakdown, Client Conflict, Inappropriate Behavior, Other
- Export button

**New Incident Form** (role-adaptive for Dispatch vs Fleet)
- General section: reporter, department, email, driver name
- Details section: location, date, time, trip ID, vehicle selector, plate, type picker (radio chips), description
- Damages section
- Fleet-only sections: people involved, consequences (None / Delay / Material / Complaint checkboxes), supervisor recommendation (Warning / Suspension)
- Actions taken section

**Driver-side incident reporting**
- Simplified form pre-filled with driver name and assigned vehicle
- Personal incident history sidebar

---

## 🗺️ Trips List *(Dispatch Supervisor, Agent & Admin)*

- Tabular list of trips with client name, pickup → dropoff, status badges
- Trip status lifecycle: Pending → Assigned → In Progress → Completed / Cancelled / Refused

---

## 🚗 Vehicle Management *(Fleet Manager & Admin)*

**Vehicle List**
- Table with plate, brand/model/year, fuel type, current km, assigned driver, insurance expiry, status
- Search by plate / brand / model
- Filter by status (Available / On Trip / Maintenance / Out of Service)
- Click row to open vehicle detail page

**Add Vehicle — 3-step wizard**
1. Informations: internal label, brand, model, chassis number, plate, year, acquisition date, fuel type, condition (New / Used), initial km
2. Carte grise (registration card): file drop zone (JPG/PNG/PDF)
3. Photos: drag-and-drop photo grid (up to 8 photos), add/remove per photo

**Vehicle Detail Page**
- Full vehicle profile with all fields

---

## 👨‍✈️ Driver Management *(Fleet Manager & Admin)*

**Driver List**
- Table with avatar, name, employee ID, phone, license expiry, star rating, status
- Search by name / phone / employee ID
- Filter by status (Active / On Leave / Suspended)
- Click row to open driver detail page

**Add Driver — 3-step wizard**
1. Personal information: full name, phone, email, employee ID, hire date, license expiry date
2. Documents: license scan upload (required), national ID card upload (required), profile photo upload (optional)
3. Vehicle assignment: pick from available vehicles (optional, skippable)

**Driver Detail Page**
- Full driver profile with all fields
- Linked vehicle

---

## 📄 Driver Daily Sheets *(Fleet Manager)*

- Table of driver daily sheets: date, shift slot, vehicle plate, total trips, accepted trips, supervisor comment
- Filter by driver

---

## ⛽ Fuel Tracking *(Fleet Manager & Admin)*

- KPI cards: total fuel spend, total litres, number of fill-ups, active vehicles
- Bar chart: fuel consumption breakdown by vehicle
- Filterable table: date, vehicle plate, litres, cost, km reading, fuel type, station
- Filter by vehicle plate or search by station
- Export button
- Log new fill-up modal: date, vehicle, litres, amount, km reading, fuel type, station

---

## ✅ Checklist Management *(Fleet Manager & Driver)*

**Fleet view**
- Overview of outstanding checklists
  
**Driver checklist form** (pre-shift)
- Header: vehicle selector (pre-filled), driver name (read-only), date
- 6 check items: body condition, tires, fluid levels, lights, cleanliness, documents — each with OK / KO toggle and observations field
- Km start section: km counter, departure time, additional remarks
- Validation prevents submission if any item is left unanswered

---

## 🛡️ Compliance (Document Expiry) *(Fleet Manager & Admin)*

- Vehicle compliance table: insurance and registration card expiry per vehicle, colour-coded days-remaining badge (green / warning / expired)
- Driver compliance table: driving license expiry per driver, same colour-coded badge
- Both tables sorted by soonest expiry first

---

## 📊 Dispatch Dashboard *(Dispatch Supervisor & Agent)*

- KPI cards: total trips, success rate, cancel rate, open incidents, avg wait time, avg assignment time, fleet availability, active drivers
- Line chart: trips over past 7 days
- Donut chart: cancellation reasons breakdown
- Donut chart: incidents by type
- Recent trips live feed (client, route, time, status badge)
- Quick-action buttons: New Shift Report, Report Incident

---

## 📈 Fleet Dashboard *(Fleet Manager)*

- KPI cards: fleet availability, vehicles in maintenance, active drivers, expiring documents, total fuel spend, avg fuel per fill-up, open incidents, total km
- Bar chart: fuel by vehicle
- Donut chart: incidents by type
- Expiring documents alert list (vehicles with insurance expiring within 60 days)

---

## 🧑‍🔧 Driver Personal Space *(Driver role)*

**Dashboard**
- Personalised greeting with today's date
- KPI cards: total trips, completed trips, average rating, assigned vehicle
- Recent trips list
- Today's checklist status, shift slot, vehicle plate
- Quick-access shortcuts (checklist / activity / report incident)

**My Activity**
- KPI cards: total / completed / cancelled trips, incidents
- Line chart: trips per day (last 7 days)
- Service quality scores (punctuality, presentation, rule compliance) with progress bars
- Daily sheets table: date, shift, vehicle, trips, accepted, supervisor comment
- Recent trips table with status badges

**My Checklist**
- Same pre-shift checklist form as Fleet view, pre-filled with own vehicle

**Report Incident**
- Simplified incident form (pre-filled with driver + vehicle)
- Personal incident history panel on the side
