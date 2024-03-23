import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    const status = exception.getStatus()

    console.log(exception)

    response.status(status).json({
      statusCode: status,
      path: request.url,
      error: exception.status === 422 ? (exception.response.message ? exception.response.message : exception.response) : { message: exception.message },
    })
  }
}
