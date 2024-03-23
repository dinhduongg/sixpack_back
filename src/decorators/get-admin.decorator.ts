import { createParamDecorator } from '@nestjs/common/decorators'
import { ExecutionContext } from '@nestjs/common/interfaces'

export const GetAdmin = createParamDecorator(async (_data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const token = request.headers['authorization'] as string
  const admin = request['admin']
  return { ...admin, token: token.split(' ')[1] }
})
