import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncBatchRequest, SyncBatchResponse } from '@ekaydi/shared-types';

@ApiTags('Offline Synchronization')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process batch of queued offline operations with idempotency keys' })
  @ApiResponse({ status: 200, description: 'Batch processed successfully with resolution details' })
  syncBatch(@Body() body: SyncBatchRequest): SyncBatchResponse {
    return this.syncService.processBatch(body);
  }
}
