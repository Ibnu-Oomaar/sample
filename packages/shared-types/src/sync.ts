import { SyncStatus } from './enums';

export type OfflineOperationType = 
  | 'CREATE_SALES_ORDER'
  | 'UPDATE_INVENTORY_ADJUSTMENT'
  | 'REQUEST_STOCK_TRANSFER'
  | 'CREATE_CUSTOMER'
  | 'CREATE_SUPPLIER'
  | 'RECORD_PAYMENT';

export class OfflineOperation<T = Record<string, unknown>> {
  id!: string; // client UUID
  idempotencyKey!: string;
  tenantId!: string;
  operationType!: OfflineOperationType;
  endpoint!: string;
  method!: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  payload!: T;
  createdAt!: string;
  status!: SyncStatus;
  retryCount!: number;
  lastAttemptAt?: string;
  errorMessage?: string;
  serverConflictData?: Record<string, unknown>;
}

export class SyncBatchRequest {
  tenantId!: string;
  operations!: OfflineOperation[];
}

export class SyncResultItem {
  operationId!: string;
  idempotencyKey!: string;
  success!: boolean;
  status!: SyncStatus;
  confirmedEntityId?: string;
  confirmedData?: Record<string, unknown>;
  errorMessage?: string;
  conflictDetails?: {
    conflictType: 'INSUFFICIENT_STOCK' | 'VERSION_MISMATCH' | 'RECORD_ALREADY_PROCESSED';
    serverState: Record<string, unknown>;
    clientState: Record<string, unknown>;
  };
}

export class SyncBatchResponse {
  timestamp!: string;
  totalProcessed!: number;
  results!: SyncResultItem[];
}
