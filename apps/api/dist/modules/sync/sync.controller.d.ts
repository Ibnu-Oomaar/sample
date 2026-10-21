import { SyncService } from './sync.service';
import { SyncBatchRequest, SyncBatchResponse } from '@ekaydi/shared-types';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    syncBatch(body: SyncBatchRequest): SyncBatchResponse;
}
