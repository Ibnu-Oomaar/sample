import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Warehouse Network')
@Controller('warehouses')
export class WarehousesController {
  @Get()
  @ApiOperation({ summary: 'List all warehouses for tenant' })
  findAll() {
    return [
      {
        id: 'wh-001',
        code: 'WH-MGQ-01',
        name: 'Mogadishu Central Logistics Terminal',
        city: 'Mogadishu',
        capacitySqm: 8500,
        totalCapacityPallets: 4200,
        currentOccupancyPallets: 3340,
        isActive: true,
      },
      {
        id: 'wh-002',
        code: 'WH-BER-02',
        name: 'Berbera Maritime Port Logistics Complex',
        city: 'Berbera',
        capacitySqm: 12000,
        totalCapacityPallets: 6500,
        currentOccupancyPallets: 4850,
        isActive: true,
      }
    ];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse details by ID' })
  findOne(@Param('id') id: string) {
    return {
      id,
      code: 'WH-MGQ-01',
      name: 'Mogadishu Central Logistics Terminal',
      city: 'Mogadishu',
      capacitySqm: 8500,
      totalCapacityPallets: 4200,
      currentOccupancyPallets: 3340,
      zones: [
        { code: 'ZONE-A', name: 'High-Bay Heavy Pallets', currentPallets: 1520, capacityPallets: 1800 },
        { code: 'ZONE-B', name: 'Picking Fast Moving', currentPallets: 980, capacityPallets: 1200 },
      ],
    };
  }
}
