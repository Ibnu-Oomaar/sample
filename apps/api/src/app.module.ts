import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { SyncModule } from './modules/sync/sync.module';
import { AuthModule } from './modules/auth/auth.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';
import { TransfersModule } from './modules/transfers/transfers.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    HealthModule,
    SyncModule,
    AuthModule,
    WarehousesModule,
    TransfersModule,
    ProductsModule,
  ],
})
export class AppModule {}
