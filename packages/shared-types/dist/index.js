// src/enums.ts
var UserRole;
((UserRole2) => {
  UserRole2["SUPER_ADMIN"] = "SUPER_ADMIN";
  UserRole2["TENANT_ADMIN"] = "TENANT_ADMIN";
  UserRole2["WAREHOUSE_MANAGER"] = "WAREHOUSE_MANAGER";
  UserRole2["INVENTORY_MANAGER"] = "INVENTORY_MANAGER";
  UserRole2["PURCHASING_MANAGER"] = "PURCHASING_MANAGER";
  UserRole2["SALES_MANAGER"] = "SALES_MANAGER";
  UserRole2["ACCOUNTANT"] = "ACCOUNTANT";
  UserRole2["STAFF"] = "STAFF";
})(UserRole ||= {});
var TenantPlan;
((TenantPlan2) => {
  TenantPlan2["STARTER"] = "STARTER";
  TenantPlan2["BUSINESS"] = "BUSINESS";
  TenantPlan2["ENTERPRISE"] = "ENTERPRISE";
})(TenantPlan ||= {});
var TenantStatus;
((TenantStatus2) => {
  TenantStatus2["ACTIVE"] = "ACTIVE";
  TenantStatus2["SUSPENDED"] = "SUSPENDED";
  TenantStatus2["TRIAL"] = "TRIAL";
})(TenantStatus ||= {});
var BusinessType;
((BusinessType2) => {
  BusinessType2["WHOLESALE_IMPORT"] = "WHOLESALE_IMPORT";
  BusinessType2["RETAIL_SUPERMARKET"] = "RETAIL_SUPERMARKET";
})(BusinessType ||= {});
var StockMovementType;
((StockMovementType2) => {
  StockMovementType2["PURCHASE_RECEIPT"] = "PURCHASE_RECEIPT";
  StockMovementType2["SALES_DISPATCH"] = "SALES_DISPATCH";
  StockMovementType2["TRANSFER_OUT"] = "TRANSFER_OUT";
  StockMovementType2["TRANSFER_IN"] = "TRANSFER_IN";
  StockMovementType2["STOCK_ADJUSTMENT"] = "STOCK_ADJUSTMENT";
  StockMovementType2["RETURN"] = "RETURN";
  StockMovementType2["DAMAGE_WRITE_OFF"] = "DAMAGE_WRITE_OFF";
})(StockMovementType ||= {});
var TransferStatus;
((TransferStatus2) => {
  TransferStatus2["REQUESTED"] = "REQUESTED";
  TransferStatus2["APPROVED"] = "APPROVED";
  TransferStatus2["DISPATCHED"] = "DISPATCHED";
  TransferStatus2["IN_TRANSIT"] = "IN_TRANSIT";
  TransferStatus2["RECEIVED"] = "RECEIVED";
  TransferStatus2["REJECTED"] = "REJECTED";
  TransferStatus2["CANCELLED"] = "CANCELLED";
})(TransferStatus ||= {});
var PurchaseOrderStatus;
((PurchaseOrderStatus2) => {
  PurchaseOrderStatus2["DRAFT"] = "DRAFT";
  PurchaseOrderStatus2["SUBMITTED"] = "SUBMITTED";
  PurchaseOrderStatus2["APPROVED"] = "APPROVED";
  PurchaseOrderStatus2["PARTIALLY_RECEIVED"] = "PARTIALLY_RECEIVED";
  PurchaseOrderStatus2["RECEIVED"] = "RECEIVED";
  PurchaseOrderStatus2["CANCELLED"] = "CANCELLED";
})(PurchaseOrderStatus ||= {});
var SalesOrderStatus;
((SalesOrderStatus2) => {
  SalesOrderStatus2["DRAFT"] = "DRAFT";
  SalesOrderStatus2["CONFIRMED"] = "CONFIRMED";
  SalesOrderStatus2["PROCESSING"] = "PROCESSING";
  SalesOrderStatus2["DISPATCHED"] = "DISPATCHED";
  SalesOrderStatus2["DELIVERED"] = "DELIVERED";
  SalesOrderStatus2["CANCELLED"] = "CANCELLED";
})(SalesOrderStatus ||= {});
var InvoiceStatus;
((InvoiceStatus2) => {
  InvoiceStatus2["UNPAID"] = "UNPAID";
  InvoiceStatus2["PARTIAL"] = "PARTIAL";
  InvoiceStatus2["PAID"] = "PAID";
  InvoiceStatus2["OVERDUE"] = "OVERDUE";
  InvoiceStatus2["VOID"] = "VOID";
})(InvoiceStatus ||= {});
var InvoiceType;
((InvoiceType2) => {
  InvoiceType2["PURCHASE"] = "PURCHASE";
  InvoiceType2["SALE"] = "SALE";
})(InvoiceType ||= {});
var PaymentMethod;
((PaymentMethod2) => {
  PaymentMethod2["CASH"] = "CASH";
  PaymentMethod2["BANK_TRANSFER"] = "BANK_TRANSFER";
  PaymentMethod2["MOBILE_MONEY"] = "MOBILE_MONEY";
  PaymentMethod2["CREDIT"] = "CREDIT";
})(PaymentMethod ||= {});
var SyncStatus;
((SyncStatus2) => {
  SyncStatus2["QUEUED"] = "QUEUED";
  SyncStatus2["SYNCING"] = "SYNCING";
  SyncStatus2["SYNCED"] = "SYNCED";
  SyncStatus2["FAILED"] = "FAILED";
  SyncStatus2["CONFLICT"] = "CONFLICT";
})(SyncStatus ||= {});
// src/sync.ts
class OfflineOperation {
  id;
  idempotencyKey;
  tenantId;
  operationType;
  endpoint;
  method;
  payload;
  createdAt;
  status;
  retryCount;
  lastAttemptAt;
  errorMessage;
  serverConflictData;
}

class SyncBatchRequest {
  tenantId;
  operations;
}

class SyncResultItem {
  operationId;
  idempotencyKey;
  success;
  status;
  confirmedEntityId;
  confirmedData;
  errorMessage;
  conflictDetails;
}

class SyncBatchResponse {
  timestamp;
  totalProcessed;
  results;
}
export {
  BusinessType,
  InvoiceStatus,
  InvoiceType,
  OfflineOperation,
  PaymentMethod,
  PurchaseOrderStatus,
  SalesOrderStatus,
  StockMovementType,
  SyncBatchRequest,
  SyncBatchResponse,
  SyncResultItem,
  SyncStatus,
  TenantPlan,
  TenantStatus,
  TransferStatus,
  UserRole
};
