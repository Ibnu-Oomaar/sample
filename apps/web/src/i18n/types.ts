export type Language = 'en' | 'so' | 'ar';

export interface Translations {
  common: {
    appName: string;
    tagline: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    actions: string;
    search: string;
    filter: string;
    status: string;
    all: string;
    export: string;
    print: string;
    refresh: string;
    online: string;
    offline: string;
    syncing: string;
    synced: string;
    syncFailed: string;
    pendingSyncCount: string;
    viewDetails: string;
    success: string;
    error: string;
    confirm: string;
  };
  nav: {
    dashboard: string;
    warehouses: string;
    inventory: string;
    products: string;
    transfers: string;
    purchases: string;
    sales: string;
    finance: string;
    suppliers: string;
    customers: string;
    expenses: string;
    reports: string;
    auditLogs: string;
    settings: string;
    syncCenter: string;
    signOut: string;
    switchRole: string;
    marketingSite: string;
  };
  dashboards: {
    superAdmin: string;
    tenantAdmin: string;
    warehouseManager: string;
    inventoryManager: string;
    purchasingManager: string;
    salesManager: string;
    accountant: string;
    staff: string;
  };
  warehouses: {
    title: string;
    capacity: string;
    occupancy: string;
    zones: string;
    racks: string;
    shelves: string;
    floorPlan2D: string;
    floorPlan3D: string;
    createWarehouse: string;
    selectWarehouse: string;
    receivingDock: string;
    dispatchDock: string;
  };
  inventory: {
    title: string;
    totalSkus: string;
    totalValuation: string;
    onHand: string;
    reserved: string;
    damaged: string;
    reorderLevel: string;
    adjustStock: string;
    batchNumber: string;
    expiryDate: string;
    binLocation: string;
  };
  transfers: {
    title: string;
    newTransfer: string;
    sourceWarehouse: string;
    destWarehouse: string;
    transferNo: string;
    itemsCount: string;
    timeline: string;
    statusRequested: string;
    statusApproved: string;
    statusDispatched: string;
    statusInTransit: string;
    statusReceived: string;
  };
  sales: {
    title: string;
    orders: string;
    newOrder: string;
    customer: string;
    amount: string;
    paymentStatus: string;
  };
  purchases: {
    title: string;
    orders: string;
    newOrder: string;
    supplier: string;
    approvalStatus: string;
  };
  finance: {
    title: string;
    revenue: string;
    expenses: string;
    grossProfit: string;
    netProfit: string;
    receivables: string;
    payables: string;
  };
  offline: {
    bannerOffline: string;
    bannerPending: string;
    syncNow: string;
    syncComplete: string;
    lastSynced: string;
  };
}
