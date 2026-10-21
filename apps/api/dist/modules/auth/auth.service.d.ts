import { UserRole, BusinessType, TenantPlan, TenantStatus } from '@ekaydi/shared-types';
export declare class AuthService {
    login(email: string, role?: UserRole): Promise<{
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
    registerBusiness(data: {
        businessName: string;
        businessType: BusinessType;
        adminEmail: string;
        adminName: string;
    }): Promise<{
        tenant: {
            id: string;
            name: string;
            businessType: BusinessType;
            plan: TenantPlan;
            status: TenantStatus;
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
