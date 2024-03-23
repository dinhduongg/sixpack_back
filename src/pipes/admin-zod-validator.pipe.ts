import { PipeTransform, ArgumentMetadata, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { errorMapper } from '../utilities/format-schema-error'

export class AdminZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value)
      return parsedValue
    } catch (error) {
      if (error instanceof ZodError) {
        const err = errorMapper(error)
        throw new UnprocessableEntityException(err)
      }
      throw new BadRequestException('Validation failed')
    }
  }
}
