import { AuthService } from './auth.service';
import { UserRole, BusinessType } from '@ekaydi/shared-types';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        role?: UserRole;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: string;
            email: string;
            fullName: string;
            role: UserRole;
            tenantId: string;
        };
    }>;
    registerBusiness(body: {
        businessName: string;
        businessType: BusinessType;
        adminEmail: string;
        adminName: string;
    }): Promise<{
        tenant: {
            id: string;
            name: string;
            businessType: BusinessType;
            plan: import("@ekaydi/shared-types").TenantPlan;
            status: import("@ekaydi/shared-types").TenantStatus;
            currency: string;
            taxRate: number;
        };
        user: {
            id: string;
            tenantId: string;
            email: string;
            fullName: string;
            role: UserRole;
        };
        accessToken: string;
    }>;
}
