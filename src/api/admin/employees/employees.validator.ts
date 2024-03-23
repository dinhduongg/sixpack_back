import * as z from 'zod'

export const employeeDTO = z
  .object({
    employee: z
      .object(
        {
          name: z.string().optional(),
          email: z.string().optional(),
          password: z.string().optional(),
          password_confirmation: z.string().optional(),
        },
        { required_error: 'DEV: bắt buộc' },
      )
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Mật khẩu không khớp',
        path: ['password_confirmation'],
      }),
  })
  .superRefine((val, ctx) => {
    if (!val.employee.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['name'],
      })
    }

    if (!val.employee.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['email'],
      })
    }

    if (!val.employee.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['password'],
      })
    }

    return z.NEVER
  })

export type EmployeeDTO = z.infer<typeof employeeDTO>
