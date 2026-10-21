import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from '../i18n';
import { ThemeProvider } from '../theme/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { SyncProvider } from '../offline/SyncContext';

import { AppLayout } from '../components/layout/AppLayout';
import { LandingPage } from '../features/landing/LandingPage';
import { DashboardDispatcher } from '../features/dashboards/DashboardDispatcher';
import { WarehousesPage } from '../features/modules/WarehousesPage';
import { ProductsPage } from '../features/modules/ProductsPage';
import { InventoryPage } from '../features/modules/InventoryPage';
import { TransfersPage } from '../features/modules/TransfersPage';
import { PurchasesPage } from '../features/modules/PurchasesPage';
import { SalesPage } from '../features/modules/SalesPage';
import { FinancePage } from '../features/modules/FinancePage';
import { CRMPage } from '../features/modules/CRMPage';
import { ExpensesPage } from '../features/modules/ExpensesPage';
import { ReportsPage } from '../features/modules/ReportsPage';
import { AuditLogsPage } from '../features/modules/AuditLogsPage';
import { SyncCenterPage } from '../features/modules/SyncCenterPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <SyncProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Marketing Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authenticated SaaS Workspace */}
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardDispatcher />} />
                  <Route path="warehouses" element={<WarehousesPage />} />
                  <Route path="inventory" element={<InventoryPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="transfers" element={<TransfersPage />} />
                  <Route path="purchases" element={<PurchasesPage />} />
                  <Route path="sales" element={<SalesPage />} />
                  <Route path="finance" element={<FinancePage />} />
                  <Route path="crm" element={<CRMPage />} />
                  <Route path="expenses" element={<ExpensesPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="audit-logs" element={<AuditLogsPage />} />
                  <Route path="sync-center" element={<SyncCenterPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </SyncProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};
