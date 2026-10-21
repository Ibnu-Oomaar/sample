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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
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
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List catalog products with active stock levels' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAll", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Product Catalog & Inventory'),
    (0, common_1.Controller)('products')
], ProductsController);
//# sourceMappingURL=products.controller.js.map