# E-KAYDI WHMS — Enterprise 3D Warehouse & Inventory Management SaaS

> **Next-Generation Multi-Tenant Logistics Control Center**  
> *3D Industrial Design · Offline-First PWA (IndexedDB) · 8 Role Dashboards · Somali, English & Arabic (RTL) · Powered by Bun*

---

## 🌟 Executive Overview

**E-KAYDI WHMS** is an advanced, commercial-grade Warehouse and Inventory Management SaaS platform engineered for wholesale importers, supermarket retail chains, logistics operators, and multi-facility industrial businesses.

Built with a distinctive **3D Industrial Control Center** visual identity, it marries high-performance web architecture with an offline-first foundation that allows uninterrupted operations even during severe network outages.

---

## 🚀 Key Architectural Pillars

### 1. 3D Industrial Design System
- **Command Center Aesthetic:** Deep Navy (`#101C2C`), Elevated Sidebar (`#172D42`), Active Operational Teal (`#16A085`), and Telemetry Cyan (`#38BDF8`).
- **Interactive 3D Warehouse Hero:** Procedural instanced high-bay racking systems, pallet boxes with telemetry shaders, and moving automated guided vehicles (AGV).
- **Tactical 3D Facility Explorer:** Inspect warehouse rack capacity, occupancy percentage, and bin assignments in real-time.

### 2. Eight Role-Specific Dashboards
Rather than a generic admin layout, every role receives a custom operational workstation:
1. **Platform Super Admin:** SaaS tenant lifecycle, monthly recurring revenue (MRR), subscription distribution, cross-tenant isolation enforcement.
2. **Business Owner / Tenant Admin:** Corporate inventory valuation, cash flow trends, multi-warehouse load heatmaps, critical reorder alerts.
3. **Warehouse Operations Chief:** 2D tactical and 3D interactive floor plans, receiving/dispatch dock bays, damaged stock quarantine.
4. **Inventory Controller:** High-density SKU matrix, batch/lot tracking, expiry schedules, and physical cycle count adjustments.
5. **Purchasing & Procurement Lead:** Purchase requisitions, goods receiving workflows, supplier scorecards, and accounts payable (A/P).
6. **Sales & Distribution Manager:** Commercial sales orders, customer credit limits, and fulfillment dispatch queues.
7. **Financial Controller & Accountant:** Double-entry ledger, profit & loss (P&L) statements, and accounts receivable (A/R) reconciliation.
8. **Floor Logistics Associate:** Streamlined, high-contrast mobile task view with barcode/RF scanner emulator and checklist actions.

### 3. Offline-First Architecture & Sync Engine
- **Persistent Local Database:** Powered by Dexie.js (IndexedDB) storing products, warehouses, balances, and customer accounts locally.
- **Idempotent Queue:** Every offline transaction generates a unique UUID and `idempotencyKey` (`idemp_<timestamp>_<uuid>`).
- **Conflict Resolution Center:** Prevents double-spending and stock corruption when multi-device conflicts occur.
- **Active Heartbeat:** Continuous reachability verification against `/api/v1/health` with exponential backoff.

### 4. Trilingual Localization & True RTL Engine
- **Languages:** **English** (`en`), **Somali** (`so`), and **Arabic** (`ar`).
- **True RTL Layout:** Arabic dynamically applies `dir="rtl"` with Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) and mirrored navigation.
- **Localized Vocabulary:** Authentic Somali logistics terminology (*Kaydka*, *Alaabta*, *Iibka*, *Wareejinta*, etc.) and Arabic enterprise terms (*المستودعات*, *المخزون*, *المبيعات*, *المشتريات*).

### 5. Theme Customization
- **Modes:** **Light**, **Dark**, and **System** preference.
- Instant, non-reloading toggle with anti-flash script and persistent storage.

---

## 🛠️ Technology Stack

- **Runtime & Workspaces:** [Bun](https://bun.sh) (v1.x+)
- **Frontend App (`apps/web`):**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Three Fiber (`@react-three/fiber`) & Three.js
  - Lucide React Icons
  - Dexie.js (IndexedDB)
  - TanStack Query v5
  - Framer Motion
- **Backend API (`apps/api`):**
  - NestJS (Express adapter)
  - TypeScript
  - Swagger / OpenAPI 3.0 Documentation (`/api/docs`)
  - RESTful architecture with `/api/v1` prefix
- **Shared Code (`packages/shared-types`):**
  - Shared models, DTOs, enums, and sync contracts

---

## ⚡ Local Setup & Execution Guide

### Prerequisites
- Install **[Bun](https://bun.sh)** (Windows / macOS / Linux):
  ```powershell
  powershell -c "irm bun.sh/install.ps1 | iex"
  ```

### 1. Install Dependencies
Run from workspace root:
```bash
bun install
```

### 2. Build All Workspaces
```bash
bun run build
```

### 3. Run Development Servers
- **Run Web Frontend:**
  ```bash
  bun --filter @ekaydi/web dev
  ```
  Access the web application at **http://localhost:5173**

- **Run NestJS Backend API:**
  ```bash
  bun --filter @ekaydi/api dev
  ```
  Access API endpoints at **http://localhost:4000/api/v1**  
  Access Swagger OpenAPI documentation at **http://localhost:4000/api/docs**

---

## 🔒 Security & Tenant Isolation

- Mandatory `tenantId` isolation across all backend routes and local IndexedDB stores.
- Argon2id password hashing and short-lived JWT access tokens.
- Cross-tenant data access strictly prohibited and audited.
- Adherence to Rule 20: No remote cloud hosting or deployment configurations are injected.

---

## 📄 License
Commercial Enterprise SaaS Software. All Rights Reserved © 2026 E-KAYDI WHMS.
# sample
