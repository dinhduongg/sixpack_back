import { Module } from '@nestjs/common/decorators'

import { BasicsService } from './basics.service'
import { BasicsController } from './basics.controller'

@Module({
  controllers: [BasicsController],
  providers: [BasicsService],
})
export class BasicsModule {}
