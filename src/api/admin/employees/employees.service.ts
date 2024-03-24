import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException, UnprocessableEntityException } from '@nestjs/common/exceptions'
import { Prisma } from '@prisma/client'
import * as bcrypt from 'bcrypt'

import { DatabaseService } from 'src/database/database.service'
import { ChangePasswordDTO, EmployeeDTO, UpdateEmployeeDTO } from './employees.validator'
import { CommonQuery } from 'src/types/commom.type'

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

  async getAll(query: CommonQuery) {
    try {
      const { q } = query
      const where = {}

      if (q) {
        where['name'] = { contains: q }
      }

      const employees = await this.prisma.employees.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          enabled: true,
          logined: true,
          locked_at: true,
          created_at: true,
        },
      })

      return { employees }
    } catch (error) {
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

  async changePassword(id: string, dto: ChangePasswordDTO) {
    try {
      const data = dto.employee

      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(data.password, salt)

      await this.prisma.employees.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      })

      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, dto: UpdateEmployeeDTO) {
    try {
      const data = dto.employee
      const body = {}

      if (data.enabled === true) {
        body['enabled'] = true
        body['locked_at'] = new Date()
      } else {
        body['enabled'] = false
        body['locked_at'] = null
      }

      await this.prisma.employees.update({ where: { id }, data: { ...data, ...body } })

      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async updateRole(employeeId: string, roleId: string) {
    try {
      const isExist = await this.prisma.employee_roles.findFirst({ where: { employee_id: employeeId, role_id: roleId } })

      if (isExist) {
        await this.prisma.employee_roles.delete({ where: { id: isExist.id } })
      } else {
        await this.prisma.employee_roles.create({ data: { employee_id: employeeId, role_id: roleId } })
      }

      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
