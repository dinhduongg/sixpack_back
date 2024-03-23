import { Body, Controller, Param, Post } from '@nestjs/common/decorators'

import { LoginDto } from './auth.interface'
import { AuthService } from './auth.service'
import { Public } from 'src/decorators/public-route.decorator'

@Controller('admin/auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Post('sign-out/:id')
  signOut(@Param('id') id: string) {
    return this.authService.signOut(id)
  }
}
