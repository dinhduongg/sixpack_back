import * as z from 'zod'

export const roleDto = z
  .object({
    role: z.object(
      {
        name: z.string().optional(),
        role_code: z.string().optional(),
      },
      { required_error: 'DEV: role is required' },
    ),
  })
  .superRefine((val, ctx) => {
    if (!val.role.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['name'],
      })
    }

    if (!val.role.role_code) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['role_code'],
      })
    }

    return z.NEVER
  })

export type RoleDto = z.infer<typeof roleDto>
