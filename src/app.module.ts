import { Module } from '@nestjs/common/decorators'
import { ConfigModule } from '@nestjs/config'

import { AdminModule } from './api/admin/admin.module'
import { PageModule } from './api/page/page.module'
import configuration from './config/configuration'
import { DatabaseModule } from './database/database.module'

@Module({
  imports: [
    AdminModule,
    PageModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [],
})
export class AppModule {}
