import * as z from 'zod'

export const basicDto = z
  .object({
    basic: z.object(
      {
        shell: z.string().optional(),
        value: z.string().optional(),
        value_en: z.string().optional(),
        group: z.string().optional(),
      },
      { required_error: 'DEV: basic field is required' },
    ),
  })
  .superRefine((val, ctx) => {
    if (!val.basic.shell) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['shell'],
      })
    }

    if (!val.basic.value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['value'],
      })
    }

    return z.NEVER
  })

export type BasicDto = z.infer<typeof basicDto>
