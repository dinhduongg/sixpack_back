import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'

import { DatabaseService } from 'src/database/database.service'
import { BasicDto } from './basics.validator'

@Injectable()
export class BasicsService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAll(groupId?: string) {
    try {
      const where = {}

      if (groupId) {
        where['group'] = groupId
      }

      const basics = await this.prisma.basics.findMany({ where })
      return { basics }
    } catch (error) {
      console.log(error)
      throw new BadRequestException(error)
    }
  }

  async getOne(id: string) {
    try {
      const basic = await this.prisma.basics.findUnique({ where: { id } })
      return { basic }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getByShell(shell: string) {
    try {
      const basic = await this.prisma.basics.findFirst({ where: { shell } })
      return { basic }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async create(body: BasicDto) {
    try {
      const data = body.basic
      await this.prisma.basics.create({
        data: {
          shell: data.shell,
          value: data.value,
          value_en: data.value_en,
          group: data.group,
        },
      })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, body: BasicDto) {
    try {
      const data = body.basic
      await this.prisma.basics.update({ where: { id }, data })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.basics.delete({ where: { id } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
