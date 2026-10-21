"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('E-KAYDI-BOOTSTRAP');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('E-KAYDI WHMS Enterprise API')
        .setDescription('Mission-critical multi-tenant Warehouse & Inventory Management REST API with offline idempotency synchronization and 3D industrial telemetry.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = process.env.PORT || 4000;
    await app.listen(port);
    logger.log(`E-KAYDI WHMS NestJS Backend running on http://localhost:${port}/api/v1`);
    logger.log(`Swagger OpenAPI documentation active on http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map