import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common/exceptions'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { DatabaseService } from 'src/database/database.service'
import { EmployeeDTO } from './employees.validator'

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(body: EmployeeDTO) {
    try {
      const data = body.employee

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(data.password, salt)

      const employee = await this.prisma.employees.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      return { employee }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnprocessableEntityException({ email: 'Email đã tồn tại' })
        }
      }
      throw new BadRequestException(error)
    }
  }

  async getDetail(id: string) {
    try {
      const employee = await this.prisma.employees.findUnique({ where: { id } })
      return { employee }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
