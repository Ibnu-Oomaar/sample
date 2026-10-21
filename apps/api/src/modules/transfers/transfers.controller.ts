import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TransferStatus } from '@ekaydi/shared-types';

@ApiTags('Stock Transfers')
@Controller('transfers')
export class TransfersController {
  @Get()
  @ApiOperation({ summary: 'List all inter-warehouse transfers' })
  findAll() {
    return [
      {
        id: 'trans-001',
        transferNo: 'TR-2026-0089',
        sourceWarehouseName: 'Berbera Maritime Port Logistics Complex',
        destWarehouseName: 'Mogadishu Central Logistics Terminal',
        status: TransferStatus.IN_TRANSIT,
        totalQuantity: 250,
      }
    ];
  }

  @Patch(':id/advance-status')
  @ApiOperation({ summary: 'Advance transfer along 5-stage logistics state machine' })
  advanceStatus(@Param('id') id: string, @Body() body: { status: TransferStatus }) {
    return {
      id,
      status: body.status,
      timestamp: new Date().toISOString(),
      updatedBy: 'Operations Authority',
    };
  }
}
