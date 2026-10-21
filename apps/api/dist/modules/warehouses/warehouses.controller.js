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
exports.WarehousesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let WarehousesController = class WarehousesController {
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
    findOne(id) {
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
};
exports.WarehousesController = WarehousesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all warehouses for tenant' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get warehouse details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WarehousesController.prototype, "findOne", null);
exports.WarehousesController = WarehousesController = __decorate([
    (0, swagger_1.ApiTags)('Warehouse Network'),
    (0, common_1.Controller)('warehouses')
], WarehousesController);
//# sourceMappingURL=warehouses.controller.js.map