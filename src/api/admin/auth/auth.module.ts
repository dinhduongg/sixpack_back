import { JwtService } from '@nestjs/jwt'
import { Module } from '@nestjs/common/decorators'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
