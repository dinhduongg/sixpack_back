import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'

import { DatabaseService } from 'src/database/database.service'
import { RoleDto } from './roles.validator'

@Injectable()
export class RolesService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAll() {
    try {
      const roles = await this.prisma.roles.findMany()
      return { roles }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getOne(id: string) {
    try {
      const role = await this.prisma.roles.findUnique({ where: { id } })
      return { role }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, dto: RoleDto) {
    try {
      const data = dto.role

      await this.prisma.roles.update({ where: { id }, data })

      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async create(dto: RoleDto) {
    try {
      const data = dto.role
      await this.prisma.roles.create({ data: { name: data.name, role_code: data.role_code } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.roles.delete({ where: { id } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
