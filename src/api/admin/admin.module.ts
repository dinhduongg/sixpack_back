import { Module } from '@nestjs/common/decorators'
import { JwtModule } from '@nestjs/jwt'

import { EmployeesModule } from './employees/employees.module'
import { AuthModule } from './auth/auth.module'
import { APP_GUARD } from '@nestjs/core'
import { AdminGuard } from 'src/guards/admin.guard'

@Module({
  imports: [EmployeesModule, AuthModule, JwtModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AdminModule {}
