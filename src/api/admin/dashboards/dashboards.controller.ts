import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common/decorators'

import { DashboardsService } from './dashboards.service'
import { UseZodValidation } from 'src/decorators/zod.decorator'
import { DashboardDto, dashboardDto } from './dashboards.validator'

@Controller('admin/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  getAll(@Query('parent_id') parentId: string) {
    return this.dashboardsService.getAll(parentId)
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.dashboardsService.getDetail(id)
  }

  @Post()
  @UseZodValidation(dashboardDto)
  create(@Body() dto: DashboardDto) {
    return this.dashboardsService.create(dto)
  }

  @Put(':id')
  @UseZodValidation(dashboardDto)
  update(@Param('id') id: string, @Body() dto: DashboardDto) {
    return this.dashboardsService.update(id, dto)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dashboardsService.delete(id)
  }
}
