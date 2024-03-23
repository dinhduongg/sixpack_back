import { ArgumentMetadata, PipeTransform } from '@nestjs/common/interfaces'
import { UnprocessableEntityException, BadRequestException } from '@nestjs/common/exceptions'
import { ZodError } from 'zod'
import { Request } from 'express'

import { errorMapper } from 'src/utilities/format-schema-error'
import { LanguageEnum } from 'src/types/global.enum'

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: any,
    private readonly request: Request,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value

    try {
      const lang = this.extranctLanguageFromRequest()
      this.schema(lang).parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        const err = errorMapper(error)
        throw new UnprocessableEntityException(err)
      }
      throw new BadRequestException('Validation failed')
    }

    return value
  }

  private extranctLanguageFromRequest(): string {
    const locale = this.request.query.locale as LanguageEnum
    return locale ?? LanguageEnum.vi
  }
}
