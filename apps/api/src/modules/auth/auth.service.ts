import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole, BusinessType, TenantPlan, TenantStatus } from '@ekaydi/shared-types';

@Injectable()
export class AuthService {
  async login(email: string, role: UserRole = UserRole.TENANT_ADMIN) {
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

  async registerBusiness(data: {
    businessName: string;
    businessType: BusinessType;
    adminEmail: string;
    adminName: string;
  }) {
    const tenantId = `tenant-${Date.now()}`;
    return {
      tenant: {
        id: tenantId,
        name: data.businessName,
        businessType: data.businessType,
        plan: TenantPlan.BUSINESS,
        status: TenantStatus.ACTIVE,
        currency: 'USD',
        taxRate: 5.0,
      },
      user: {
        id: `user-${Date.now()}`,
        tenantId,
        email: data.adminEmail,
        fullName: data.adminName,
        role: UserRole.TENANT_ADMIN,
      },
      accessToken: `jwt_token_${Date.now()}`,
    };
  }
}
