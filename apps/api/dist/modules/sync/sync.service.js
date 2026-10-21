"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@ekaydi/shared-types");
let SyncService = SyncService_1 = class SyncService {
    constructor() {
        this.logger = new common_1.Logger(SyncService_1.name);
        this.processedIdempotencyKeys = new Set();
    }
    processBatch(batch) {
        this.logger.log(`Processing offline sync batch for tenant ${batch.tenantId} with ${batch.operations?.length || 0} operations`);
        const results = [];
        for (const op of (batch.operations || [])) {
            if (this.processedIdempotencyKeys.has(op.idempotencyKey)) {
                this.logger.warn(`Operation already processed with key: ${op.idempotencyKey}`);
                results.push({
                    operationId: op.id,
                    idempotencyKey: op.idempotencyKey,
                    success: true,
                    status: shared_types_1.SyncStatus.SYNCED,
                    confirmedEntityId: op.id,
                });
                continue;
            }
            this.processedIdempotencyKeys.add(op.idempotencyKey);
            this.logger.log(`Successfully committed offline operation: ${op.operationType} (${op.id})`);
            results.push({
                operationId: op.id,
                idempotencyKey: op.idempotencyKey,
                success: true,
                status: shared_types_1.SyncStatus.SYNCED,
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
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)()
], SyncService);
//# sourceMappingURL=sync.service.js.map