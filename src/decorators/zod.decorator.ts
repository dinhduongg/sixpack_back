import { UseInterceptors } from '@nestjs/common/decorators'

import { ZodValidationInterceptor } from 'src/interceptors/ZodValidationInterceptor.interceptor'

export function UseZodValidation(schema: any) {
  return UseInterceptors(new ZodValidationInterceptor(schema))
}
