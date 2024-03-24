import { createParamDecorator } from '@nestjs/common/decorators'
import { ExecutionContext } from '@nestjs/common/interfaces'

export const GetQuery = createParamDecorator(async (_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()

  const query = request.query
  const body = request.body

  return { ...query, ...body }
})
