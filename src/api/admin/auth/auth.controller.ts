import { Body, Controller, Post } from '@nestjs/common/decorators'

import { GetAdmin } from 'src/decorators/get-admin.decorator'
import { Public } from 'src/decorators/public-route.decorator'
import { AdminDetail } from 'src/types/commom.type'
import { LoginDto } from './auth.interface'
import { AuthService } from './auth.service'

@Controller('admin/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Public()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('sign-out')
  signOut(@GetAdmin() admin: AdminDetail) {
    return this.authService.signOut(admin)
  }
}
