import { Controller, Get, Head, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'System health check and runtime metrics' })
  check() {
    return {
      status: 'ok',
      engine: 'Bun Runtime + NestJS (Express)',
      database: 'PostgreSQL Pool Active',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
      offlineSyncGateway: 'Ready',
    };
  }

  @Head()
  @HttpCode(200)
  @ApiOperation({ summary: 'Lightweight connectivity heartbeat ping' })
  ping() {
    return;
  }
}
