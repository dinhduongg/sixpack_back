import { Module } from '@nestjs/common/decorators'

import { RolesService } from './roles.service'
import { RolesController } from './roles.controller'

@Module({
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
