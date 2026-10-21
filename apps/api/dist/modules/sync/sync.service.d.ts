import { SyncBatchRequest, SyncBatchResponse } from '@ekaydi/shared-types';
export declare class SyncService {
    private readonly logger;
    private readonly processedIdempotencyKeys;
    processBatch(batch: SyncBatchRequest): SyncBatchResponse;
}
