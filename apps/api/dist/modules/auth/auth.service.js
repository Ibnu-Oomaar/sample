"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const shared_types_1 = require("@ekaydi/shared-types");
let AuthService = class AuthService {
    async login(email, role = shared_types_1.UserRole.TENANT_ADMIN) {
        return {
            accessToken: `jwt_token_${Date.now()}_${role}`,
            refreshToken: `jwt_refresh_${Date.now()}`,
            expiresIn: 3600,
            user: {
                id: `user_${Date.now()}`,
                email,
                fullName: 'Authenticated Enterprise Operator',
                role,
                tenantId: 'tenant-001',
            },
        };
    }
    async registerBusiness(data) {
        const tenantId = `tenant-${Date.now()}`;
        return {
            tenant: {
                id: tenantId,
                name: data.businessName,
                businessType: data.businessType,
                plan: shared_types_1.TenantPlan.BUSINESS,
                status: shared_types_1.TenantStatus.ACTIVE,
                currency: 'USD',
                taxRate: 5.0,
            },
            user: {
                id: `user-${Date.now()}`,
                tenantId,
                email: data.adminEmail,
                fullName: data.adminName,
                role: shared_types_1.UserRole.TENANT_ADMIN,
            },
            accessToken: `jwt_token_${Date.now()}`,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map