import { Module } from '@nestjs/common/decorators'

import { DashboardsService } from './dashboards.service'
import { DashboardsController } from './dashboards.controller'

@Module({
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule {}
