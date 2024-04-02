/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

import { DatabaseService } from 'src/database/database.service'
import { IS_PUBLIC_KEY } from 'src/decorators/public-route.decorator'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly config: ConfigService,
    private reflector: Reflector,
    private readonly prisma: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])

    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) throw new UnauthorizedException()

    const sessionData = await this.prisma.employee_sessions.findFirst({ where: { session_token: token } })

    if (!sessionData) {
      throw new UnauthorizedException()
    }

    const now = new Date()
    const expiredTokenTime = new Date(sessionData.expired_time)

    if (now >= expiredTokenTime) {
      throw new UnauthorizedException()
    }

    const employee = await this.prisma.employees.findUnique({
      where: { id: sessionData.employee_id },
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

    const { roles, created_at, enabled, locked_at, logined, password, updated_at, ...results } = employee
    const employeeRoles = roles.map((role) => role.role.role_code)

    request['admin'] = {
      roles: employeeRoles,
      ...results,
    }

    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
