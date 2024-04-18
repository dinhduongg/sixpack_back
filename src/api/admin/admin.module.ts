import { Module } from '@nestjs/common/decorators'
import { JwtModule } from '@nestjs/jwt'
import { APP_GUARD } from '@nestjs/core'

import { EmployeesModule } from './employees/employees.module'
import { AuthModule } from './auth/auth.module'
import { AdminGuard } from 'src/guards/admin.guard'
import { RolesModule } from './roles/roles.module'
import { DashboardsModule } from './dashboards/dashboards.module'
import { BasicsModule } from './basics/basics.module'

@Module({
  imports: [EmployeesModule, AuthModule, JwtModule, RolesModule, DashboardsModule, BasicsModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AdminModule {}
