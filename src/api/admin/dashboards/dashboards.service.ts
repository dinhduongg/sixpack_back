import { Injectable } from '@nestjs/common/decorators'
import { BadRequestException } from '@nestjs/common/exceptions'

import { DatabaseService } from 'src/database/database.service'
import { DashboardDto } from './dashboards.validator'

@Injectable()
export class DashboardsService {
  constructor(private readonly prisma: DatabaseService) {}

  async getAll(parentId: string, q?: string | undefined) {
    try {
      const where = {}

      if (parentId) {
        where['parent_id'] = parentId
      } else {
        where['parent_id'] = null
      }

      if (q) {
        where['name'] = {
          contains: q,
          mode: 'insensitive',
        }
      }

      const dashboards = await this.prisma.dashboards.findMany({
        where,
        orderBy: { sorted: 'asc' },
        include: {
          childrens: true,
        },
      })

      return { dashboards }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async getDetail(id: string) {
    try {
      const dashboard = await this.prisma.dashboards.findUnique({ where: { id } })
      return { dashboard }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async create(dto: DashboardDto) {
    try {
      const data = dto.dashboard
      await this.prisma.dashboards.create({ data: { name: data.name, ...data } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(id: string, dto: DashboardDto) {
    try {
      const data = dto.dashboard
      await this.prisma.dashboards.update({ where: { id }, data })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async delete(id: string) {
    try {
      await this.prisma.dashboards.delete({ where: { id } })
      return { message: 'Thành công' }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }
}
