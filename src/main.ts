import 'reflect-metadata'
import { VersioningType } from '@nestjs/common/enums/version-type.enum'
import { Logger } from '@nestjs/common/services'
import { ConfigService } from '@nestjs/config'
import { NextFunction, Request, Response, json } from 'express'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './filters/http-exception.filter'
import { TransformInterceptor } from './interceptors/transform.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const logger = new Logger('AppModule')

  // configuration
  const config = app.get(ConfigService)
  const port = config.get<number>('port')

  app.setGlobalPrefix('/api')
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
  })

  app.enableCors({
    origin: true,
    credentials: true,
  })

  app.use(json({ limit: '50mb' }))

  await app.listen(port)

  logger.verbose(
    '\n--------------------------------------------------------------------------------' + '\nBACKEND SERVER IS RUNNING AT http://localhost:' + port,
    '\nTIMEZONE is ' +
      Intl.DateTimeFormat().resolvedOptions().timeZone +
      ', current Time is ' +
      new Date().toLocaleString('en-GB') +
      '\n--------------------------------------------------------------------------------',
  )
}
bootstrap()
