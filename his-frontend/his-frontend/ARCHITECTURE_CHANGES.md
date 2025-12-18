# Frontend Architecture Refactoring Report

## 1. Overview
We have refactored the HIS Frontend to align with a **Role-Based Architecture** and prepared the **Data Access Layer** for seamless Backend integration.

## 2. Key Changes

### A. Role-Based Structure (Navigation & Routing)
- **Outpatient Workstation**: Grouped Registration, History, and Patient Management.
- **Doctor Workstation**: Dedicated workbench for Doctors.
- **Pharmacy Workstation**: Inventory and Dispensing management.
- **Finance Workstation**: Billing and Payment.
- **Menu Updated**: `MainLayout.vue` now reflects these workstations clearly.

### B. Data Adapter Layer (`src/api`)
We introduced a "Adapter Pattern" in the API layer to bridge the gap between Frontend UI requirements and Backend DTOs.

- **`src/api/types.ts`**: Defined TypeScript interfaces that strictly match the Backend Entities (e.g., `PatientDTO` with `pid`, `allergy`; `PharmacyInventoryDTO` with `stockQuantity`).
- **Adapters (`outpatient.ts`, etc.)**: 
  - Exposed stable "Frontend Interfaces" (e.g., `Patient` with `patientId`) to Views.
  - Internally mapped these to "Backend DTOs" before sending requests.
  - **Benefit**: Views don't need to change when Backend fields change; we only update the Adapter.

### C. Backend Alignment (Pre-Integration)
- **API Paths**: Updated all mock API paths to match the real Backend Controllers (e.g., `/api/doctor/record` -> `/api/medical-record`, `/api/pharmacy/dispensing/:id` -> `/api/pharmacy/dispense`).
- **Field Naming**: Updated Mock data and some Views to use Backend standard naming (e.g., `stockQuantity` instead of `quantity`, `id` instead of `medicineId`).

### D. Mock Server Update
- Updated `src/mocks/*.ts` to intercept the new Backend-compatible paths and return data in the expected DTO structure.
- This ensures the frontend runs normally in "Mock Mode" but is ready to switch to "Real Backend" simply by toggling `VITE_USE_MOCK`.

## 3. Verification
- **Build Status**: `npm run build` passed successfully.
- **Type Safety**: TypeScript errors in Views (caused by field renaming) have been resolved.

## 4. Next Steps
- **Component Extraction**: Further refactor repeated UI elements (like Patient Search Bar) into `src/components`.
- **Backend Connection**: Once the Java Backend is running, set `VITE_USE_MOCK=false` in `.env` to switch to real data.
