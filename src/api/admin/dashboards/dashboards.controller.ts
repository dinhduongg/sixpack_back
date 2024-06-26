import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common/decorators'

import { DashboardsService } from './dashboards.service'
import { UseZodValidation } from 'src/decorators/zod.decorator'
import { DashboardDto, dashboardDto } from './dashboards.validator'
import { Public } from 'src/decorators/public-route.decorator'

@Controller('admin/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get()
  @Public()
  getAll(@Query('parent_id') parentId: string, @Query('q') q?: string | undefined) {
    return this.dashboardsService.getAll(parentId, q)
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
