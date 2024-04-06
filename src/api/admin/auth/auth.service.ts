/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { DatabaseService } from 'src/database/database.service'
import { LoginDto } from './auth.interface'
import { AdminDetail, TokenPayload } from 'src/types/commom.type'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const employee = await this.prisma.employees.findFirst({
      where: { email },
      include: {
        roles: {
          select: {
            role: {
              select: {
                role_code: true,
              },
            },
          },
        },
      },
    })
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

      if (!user) {
        throw new Error('Email hoặc mật khẩu không chính xác')
      }

      if (!user.enabled) {
        throw new BadRequestException('Tài khoản đã bị khóa')
      }

      const employee = await this.prisma.employees.update({
        where: { id: user.id },
        data: { logined: true },
        select: {
          id: true,
          name: true,
          email: true,
          roles: {
            select: {
              role: {
                select: {
                  role_code: true,
                },
              },
            },
          },
        },
      })

      const payload = {
        id: user.id,
        email: user.email,
        sub: {
          name: user.name,
        },
      }

      const { roles, ...result } = employee
      const employeeRoles = employee.roles.map((role) => role.role.role_code)

      const { token, expiredTime } = await this.generateSessionToken(payload)

      return { user: result, roles: employeeRoles, token, expired_time: expiredTime }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async signOut(admin: AdminDetail) {
    try {
      await this.prisma.employees.update({ where: { id: admin.id }, data: { logined: false } })
      await this.prisma.employee_sessions.deleteMany({ where: { employee_id: admin.id } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async generateSessionToken(payload: TokenPayload) {
    // Get current date
    const now = new Date()

    // Set time to 12:00:00 AM for the next day
    const nextDay = new Date(now)
    nextDay.setDate(nextDay.getDate() + 1)
    nextDay.setHours(0, 0, 0, 0)

    const jwtSecrect = this.config.get<string>('jwtSecrect')
    const token = await this.jwtService.signAsync(payload, { secret: jwtSecrect })

    const checkExist = await this.prisma.employee_sessions.findFirst({ where: { employee_id: payload.id } })

    if (checkExist) {
      await this.prisma.employee_sessions.update({ where: { id: checkExist.id }, data: { session_token: token, expired_time: nextDay } })
    } else {
      await this.prisma.employee_sessions.create({
        data: {
          employee_id: payload.id,
          expired_time: nextDay,
          session_token: token,
        },
      })
    }

    return { token, expiredTime: nextDay }
  }
}
