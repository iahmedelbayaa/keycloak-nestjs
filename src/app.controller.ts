import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('private')
  getPrivate(@AuthenticatedUser() user: any): string {
    return `Hello ${user?.preferred_username || 'User'}, this is a private route!`;
  }

  @Get('admin')
  @Roles({ roles: ['admin'] })
  getAdmin(): string {
    return 'This is strictly for admins!';
  }
}
