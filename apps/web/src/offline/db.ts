import Dexie, { type EntityTable } from 'dexie';
import { 
  Product, 
  Warehouse, 
  InventoryBalance, 
  StockTransfer, 
  SalesOrder, 
  PurchaseOrder, 
  Customer, 
  Supplier, 
  OfflineOperation 
} from '@ekaydi/shared-types';

export class EKaydiOfflineDatabase extends Dexie {
  products!: EntityTable<Product, 'id'>;
  warehouses!: EntityTable<Warehouse, 'id'>;
  inventoryBalances!: EntityTable<InventoryBalance, 'id'>;
  transfers!: EntityTable<StockTransfer, 'id'>;
  salesOrders!: EntityTable<SalesOrder, 'id'>;
  purchaseOrders!: EntityTable<PurchaseOrder, 'id'>;
  customers!: EntityTable<Customer, 'id'>;
  suppliers!: EntityTable<Supplier, 'id'>;
  offlineOperations!: EntityTable<OfflineOperation, 'id'>;

  constructor() {
    super('EKaydiOfflineDB');
    this.version(1).stores({
      products: 'id, tenantId, sku, barcode, categoryId, name',
      warehouses: 'id, tenantId, code, name',
      inventoryBalances: 'id, tenantId, warehouseId, productId, binLocation',
      transfers: 'id, tenantId, transferNo, status, sourceWarehouseId, destWarehouseId',
      salesOrders: 'id, tenantId, soNo, customerId, status',
      purchaseOrders: 'id, tenantId, poNo, supplierId, status',
      customers: 'id, tenantId, name, phone',
      suppliers: 'id, tenantId, name, phone',
      offlineOperations: 'id, idempotencyKey, tenantId, operationType, status, createdAt',
    });
  }
}

export const db = new EKaydiOfflineDatabase();
