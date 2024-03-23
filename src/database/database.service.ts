import { Injectable } from '@nestjs/common/decorators'
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common/interfaces'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
