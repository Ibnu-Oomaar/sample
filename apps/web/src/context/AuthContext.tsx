import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Tenant, Warehouse, UserRole, BusinessType, TenantPlan, TenantStatus } from '@ekaydi/shared-types';
import { mockUsers, mockTenants, mockWarehouses, mockProducts, mockInventoryBalances, mockTransfers, mockCustomers, mockSuppliers, mockSalesOrders, mockPurchaseOrders } from '../services/mockData';
import { db } from '../offline/db';

interface AuthContextType {
  currentUser: User;
  currentTenant: Tenant;
  currentWarehouse: Warehouse;
  setCurrentWarehouse: (wh: Warehouse) => void;
  switchRole: (role: UserRole) => void;
  switchTenant: (tenantId: string) => void;
  login: (email: string, role?: UserRole) => void;
  registerBusiness: (businessName: string, businessType: BusinessType, adminEmail: string, adminName: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('ekaydi_simulated_role') as UserRole;
    return (savedRole && mockUsers[savedRole]) ? mockUsers[savedRole] : mockUsers[UserRole.TENANT_ADMIN];
  });

  const [currentTenant, setCurrentTenant] = useState<Tenant>(() => {
    return mockTenants[0];
  });

  const [currentWarehouse, setCurrentWarehouse] = useState<Warehouse>(() => {
    return mockWarehouses[0];
  });

  // Seed IndexedDB on initial launch if empty
  useEffect(() => {
    const seedDexie = async () => {
      try {
        const prodCount = await db.products.count();
        if (prodCount === 0) {
          await db.products.bulkAdd(mockProducts);
          await db.warehouses.bulkAdd(mockWarehouses);
          await db.inventoryBalances.bulkAdd(mockInventoryBalances);
          await db.transfers.bulkAdd(mockTransfers);
          await db.customers.bulkAdd(mockCustomers);
          await db.suppliers.bulkAdd(mockSuppliers);
          await db.salesOrders.bulkAdd(mockSalesOrders);
          await db.purchaseOrders.bulkAdd(mockPurchaseOrders);
          console.log('E-KAYDI IndexedDB successfully seeded with initial enterprise warehouse records.');
        }
      } catch (err) {
        console.error('Error populating IndexedDB:', err);
      }
    };
    seedDexie();
  }, []);

  const switchRole = (role: UserRole) => {
    if (mockUsers[role]) {
      setCurrentUser(mockUsers[role]);
      localStorage.setItem('ekaydi_simulated_role', role);
      if (mockUsers[role].assignedWarehouseId) {
        const assignedWh = mockWarehouses.find(w => w.id === mockUsers[role].assignedWarehouseId);
        if (assignedWh) setCurrentWarehouse(assignedWh);
      }
    }
  };

  const switchTenant = (tenantId: string) => {
    const found = mockTenants.find(t => t.id === tenantId);
    if (found) setCurrentTenant(found);
  };

  const login = (email: string, role: UserRole = UserRole.TENANT_ADMIN) => {
    const user = mockUsers[role];
    setCurrentUser(user);
    localStorage.setItem('ekaydi_simulated_role', role);
  };

  const registerBusiness = (businessName: string, businessType: BusinessType, adminEmail: string, adminName: string) => {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: businessName,
      subdomain: businessName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      businessType,
      plan: TenantPlan.BUSINESS,
      status: TenantStatus.ACTIVE,
      currency: 'USD',
      taxRate: 5.0,
      email: adminEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTenants.push(newTenant);
    setCurrentTenant(newTenant);

    const newUser: User = {
      id: `user-${Date.now()}`,
      tenantId: newTenant.id,
      email: adminEmail,
      fullName: adminName,
      role: UserRole.TENANT_ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers[UserRole.TENANT_ADMIN] = newUser;
    setCurrentUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('ekaydi_simulated_role');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentTenant,
        currentWarehouse,
        setCurrentWarehouse,
        switchRole,
        switchTenant,
        login,
        registerBusiness,
        logout,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
