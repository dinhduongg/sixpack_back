/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { DatabaseService } from 'src/database/database.service'
import { LoginDto } from './auth.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const employee = await this.prisma.employees.findFirst({ where: { email } })
    const matchPass = await bcrypt.compareSync(password, employee.password)

    if (employee && matchPass) {
      const { password, ...result } = employee
      return result
    }

    return null
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto.email, dto.password)

      if (!user.enabled) {
        throw new BadRequestException('Tài khoản đã bị khóa')
      }

      await this.prisma.employees.update({ where: { id: user.id }, data: { logined: true } })

      const payload = {
        email: user.email,
        sub: {
          name: user.name,
        },
      }

      const jwtSecrect = this.config.get<string>('jwtSecrect')

      const access_token = await this.jwtService.signAsync(payload, { expiresIn: '1y', secret: jwtSecrect })

      return { user, access_token }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async signOut(id: string) {
    try {
      await this.prisma.employees.update({ where: { id }, data: { logined: false } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
