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

export const changePasswordDto = z
  .object({
    employee: z
      .object(
        {
          password: z.string().optional(),
          password_confirmation: z.string().optional(),
        },
        { required_error: 'DEV: employee fiel required' },
      )
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Mật khẩu không khớp',
        path: ['password_confirmation'],
      }),
  })
  .superRefine((val, ctx) => {
    if (!val.employee.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['password'],
      })
    }

    if (!val.employee.password_confirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['password_confirmation'],
      })
    }

    return z.NEVER
  })

export const updateEmployeeDto = z.object({
  employee: z.object(
    {
      name: z.string().optional(),
      enabled: z.boolean().optional(),
    },
    { required_error: 'DEV: employee required' },
  ),
})

export type EmployeeDTO = z.infer<typeof employeeDTO>
export type ChangePasswordDTO = z.infer<typeof changePasswordDto>
export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeDto>
