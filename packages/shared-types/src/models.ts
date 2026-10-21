import { 
  UserRole, 
  TenantPlan, 
  TenantStatus, 
  BusinessType, 
  StockMovementType, 
  TransferStatus, 
  PurchaseOrderStatus, 
  SalesOrderStatus, 
  InvoiceStatus, 
  InvoiceType, 
  PaymentMethod 
} from './enums';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  businessType: BusinessType;
  plan: TenantPlan;
  status: TenantStatus;
  currency: string;
  taxRate: number;
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  tenantId?: string; // null for SUPER_ADMIN
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  assignedWarehouseId?: string;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageZone {
  id: string;
  code: string; // e.g. "ZONE-A"
  name: string;
  type: 'RECEIVING' | 'STORAGE' | 'PICKING' | 'COLD_STORAGE' | 'DISPATCH' | 'QUARANTINE';
  capacityPallets: number;
  currentPallets: number;
}

export interface Warehouse {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  address: string;
  city: string;
  capacitySqm: number;
  totalCapacityPallets: number;
  currentOccupancyPallets: number;
  managerId?: string;
  managerName?: string;
  zones: StorageZone[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  productCount?: number;
}

export interface ProductBrand {
  id: string;
  tenantId: string;
  name: string;
  country?: string;
}

export interface UnitOfMeasure {
  id: string;
  tenantId: string;
  code: string; // PCS, BOX, KG, PALLET, LTR
  name: string;
}

export interface Product {
  id: string;
  tenantId: string;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  brandId?: string;
  brandName?: string;
  unitId: string;
  unitCode?: string;
  costPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  maxStockLevel: number;
  totalQuantityOnHand?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryBalance {
  id: string;
  tenantId: string;
  warehouseId: string;
  warehouseName?: string;
  productId: string;
  productSku?: string;
  productName?: string;
  batchNumber?: string;
  expiryDate?: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityDamaged: number;
  binLocation: string; // e.g. "A-03-02" (Zone A, Rack 03, Shelf 02)
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  tenantId: string;
  referenceNo: string;
  movementType: StockMovementType;
  productId: string;
  productSku?: string;
  productName?: string;
  warehouseId: string;
  warehouseName?: string;
  quantity: number;
  unitCost: number;
  balanceAfter: number;
  reason?: string;
  performedByUserId: string;
  performedByUserName?: string;
  createdAt: string;
}

export interface StockTransferItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitCost: number;
  receivedQuantity?: number;
}

export interface StockTransfer {
  id: string;
  tenantId: string;
  transferNo: string;
  sourceWarehouseId: string;
  sourceWarehouseName?: string;
  destWarehouseId: string;
  destWarehouseName?: string;
  status: TransferStatus;
  items: StockTransferItem[];
  totalItems: number;
  totalQuantity: number;
  notes?: string;
  requestedByUserId: string;
  requestedByUserName?: string;
  approvedByUserId?: string;
  dispatchedAt?: string;
  receivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  tenantId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  address?: string;
  taxNumber?: string;
  paymentTermsDays: number;
  outstandingBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  tenantId: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  address?: string;
  tier: 'STANDARD' | 'WHOLESALE' | 'VIP';
  creditLimit: number;
  outstandingBalance: number;
  isActive: boolean;
  createdAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitCost: number;
  totalAmount: number;
  receivedQuantity: number;
}

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  poNo: string;
  supplierId: string;
  supplierName?: string;
  destWarehouseId: string;
  destWarehouseName?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  orderDate: string;
  expectedDeliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOrderItem {
  id: string;
  productId: string;
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface SalesOrder {
  id: string;
  tenantId: string;
  soNo: string;
  customerId: string;
  customerName?: string;
  sourceWarehouseId: string;
  sourceWarehouseName?: string;
  status: SalesOrderStatus;
  items: SalesOrderItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  orderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  tenantId: string;
  invoiceNo: string;
  type: InvoiceType;
  relatedOrderId: string; // PO id or SO id
  partyName: string; // Customer or Supplier name
  status: InvoiceStatus;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  issueDate: string;
  dueDate: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  tenantId: string;
  paymentNo: string;
  invoiceId: string;
  invoiceNo?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paymentDate: string;
  notes?: string;
  recordedByUserId: string;
  recordedByUserName?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  tenantId: string;
  expenseNo: string;
  category: 'RENT' | 'UTILITIES' | 'SALARIES' | 'TRANSPORT' | 'MAINTENANCE' | 'OTHER';
  warehouseId?: string;
  warehouseName?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  expenseDate: string;
  description: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId?: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  tenantId?: string;
  userId?: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}
