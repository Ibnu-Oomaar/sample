import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Product Catalog & Inventory')
@Controller('products')
export class ProductsController {
  @Get()
  @ApiOperation({ summary: 'List catalog products with active stock levels' })
  findAll() {
    return [
      {
        id: 'prod-001',
        sku: 'IND-LUB-5001',
        name: 'Heavy Industrial Turbine Lubricant ISO-VG 46',
        costPrice: 285.00,
        sellingPrice: 395.00,
        totalQuantityOnHand: 92,
      },
      {
        id: 'prod-002',
        sku: 'FMCG-SUG-50KG',
        name: 'Refined Pure White Cane Sugar (50KG Bag)',
        costPrice: 38.50,
        sellingPrice: 46.00,
        totalQuantityOnHand: 1420,
      }
    ];
  }
}
