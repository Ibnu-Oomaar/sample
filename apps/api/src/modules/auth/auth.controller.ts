import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserRole, BusinessType } from '@ekaydi/shared-types';

@ApiTags('Authentication & Multi-Tenancy')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user and issue JWT access/refresh tokens' })
  login(@Body() body: { email: string; role?: UserRole }) {
    return this.authService.login(body.email, body.role);
  }

  @Post('register-business')
  @ApiOperation({ summary: 'Register new enterprise business tenant (Wholesale or Supermarket)' })
  registerBusiness(@Body() body: {
    businessName: string;
    businessType: BusinessType;
    adminEmail: string;
    adminName: string;
  }) {
    return this.authService.registerBusiness(body);
  }
}
