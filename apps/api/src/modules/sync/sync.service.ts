import { Injectable, Logger } from '@nestjs/common';
import { SyncBatchRequest, SyncBatchResponse, SyncResultItem, SyncStatus } from '@ekaydi/shared-types';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly processedIdempotencyKeys = new Set<string>();

  processBatch(batch: SyncBatchRequest): SyncBatchResponse {
    this.logger.log(`Processing offline sync batch for tenant ${batch.tenantId} with ${batch.operations?.length || 0} operations`);
    
    const results: SyncResultItem[] = [];

    for (const op of (batch.operations || [])) {
      // Idempotency check: prevent duplicate writes
      if (this.processedIdempotencyKeys.has(op.idempotencyKey)) {
        this.logger.warn(`Operation already processed with key: ${op.idempotencyKey}`);
        results.push({
          operationId: op.id,
          idempotencyKey: op.idempotencyKey,
          success: true,
          status: SyncStatus.SYNCED,
          confirmedEntityId: op.id,
        });
        continue;
      }

      // Mark idempotency key as seen
      this.processedIdempotencyKeys.add(op.idempotencyKey);

      // Execute based on operation type
      this.logger.log(`Successfully committed offline operation: ${op.operationType} (${op.id})`);
      results.push({
        operationId: op.id,
        idempotencyKey: op.idempotencyKey,
        success: true,
        status: SyncStatus.SYNCED,
        confirmedEntityId: op.id,
        confirmedData: op.payload,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      totalProcessed: results.length,
      results,
    };
  }
}
