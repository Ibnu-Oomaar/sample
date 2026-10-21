"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransfersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shared_types_1 = require("@ekaydi/shared-types");
let TransfersController = class TransfersController {
    findAll() {
        return [
            {
                id: 'trans-001',
                transferNo: 'TR-2026-0089',
                sourceWarehouseName: 'Berbera Maritime Port Logistics Complex',
                destWarehouseName: 'Mogadishu Central Logistics Terminal',
                status: shared_types_1.TransferStatus.IN_TRANSIT,
                totalQuantity: 250,
            }
        ];
    }
    advanceStatus(id, body) {
        return {
            id,
            status: body.status,
            timestamp: new Date().toISOString(),
            updatedBy: 'Operations Authority',
        };
    }
};
exports.TransfersController = TransfersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all inter-warehouse transfers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/advance-status'),
    (0, swagger_1.ApiOperation)({ summary: 'Advance transfer along 5-stage logistics state machine' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TransfersController.prototype, "advanceStatus", null);
exports.TransfersController = TransfersController = __decorate([
    (0, swagger_1.ApiTags)('Stock Transfers'),
    (0, common_1.Controller)('transfers')
], TransfersController);
//# sourceMappingURL=transfers.controller.js.map