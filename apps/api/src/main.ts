import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('E-KAYDI-BOOTSTRAP');
  const app = await NestFactory.create(AppModule);

  // Global versioned prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Swagger OpenAPI 3.0 Documentation
  const config = new DocumentBuilder()
    .setTitle('E-KAYDI WHMS Enterprise API')
    .setDescription(
      'Mission-critical multi-tenant Warehouse & Inventory Management REST API with offline idempotency synchronization and 3D industrial telemetry.'
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`E-KAYDI WHMS NestJS Backend running on http://localhost:${port}/api/v1`);
  logger.log(`Swagger OpenAPI documentation active on http://localhost:${port}/api/docs`);
}

bootstrap();
