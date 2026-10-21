import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '@ekaydi/shared-types';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { TenantAdminDashboard } from './TenantAdminDashboard';
import { WarehouseManagerDashboard } from './WarehouseManagerDashboard';
import { InventoryManagerDashboard } from './InventoryManagerDashboard';
import { PurchasingManagerDashboard } from './PurchasingManagerDashboard';
import { SalesManagerDashboard } from './SalesManagerDashboard';
import { AccountantDashboard } from './AccountantDashboard';
import { StaffDashboard } from './StaffDashboard';

export const DashboardDispatcher: React.FC = () => {
  const { currentUser } = useAuth();

  switch (currentUser.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case UserRole.TENANT_ADMIN:
      return <TenantAdminDashboard />;
    case UserRole.WAREHOUSE_MANAGER:
      return <WarehouseManagerDashboard />;
    case UserRole.INVENTORY_MANAGER:
      return <InventoryManagerDashboard />;
    case UserRole.PURCHASING_MANAGER:
      return <PurchasingManagerDashboard />;
    case UserRole.SALES_MANAGER:
      return <SalesManagerDashboard />;
    case UserRole.ACCOUNTANT:
      return <AccountantDashboard />;
    case UserRole.STAFF:
      return <StaffDashboard />;
    default:
      return <TenantAdminDashboard />;
  }
};
