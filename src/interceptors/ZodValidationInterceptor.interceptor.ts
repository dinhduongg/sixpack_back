import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Scope } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Request } from 'express'

import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe'
import { AdminZodValidationPipe } from 'src/pipes/admin-zod-validator.pipe'

@Injectable({ scope: Scope.REQUEST })
export class ZodValidationInterceptor implements NestInterceptor {
  constructor(private readonly schema: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const originalUrl = request.originalUrl

    const arr = ['/api/admin', '/api/v1/admin', '/api/v2/admin']
    const checkAdminApiVersion = arr.some((item) => originalUrl.startsWith(item))

    if (checkAdminApiVersion) {
      const pipe = new AdminZodValidationPipe(this.schema)
      const transformedBody = pipe.transform(request.body, { type: 'body' })
      request.body = transformedBody
    } else {
      const pipe = new ZodValidationPipe(this.schema, request)
      const transformedBody = pipe.transform(request.body, { type: 'body' })
      request.body = transformedBody
    }

    return next.handle()
  }
}
