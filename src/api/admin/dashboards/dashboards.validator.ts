import * as z from 'zod'

export const dashboardDto = z
  .object({
    dashboard: z.object(
      {
        name: z.string().optional(),
        icon: z.string().optional().nullable().default(null),
        parent_id: z.string().optional().nullable().default(null),
        url: z.string().optional().nullable().default(null),
        role_code: z.string().optional().nullable().default(null),
        check_role: z.boolean().optional(),
        enabled: z.boolean().optional(),
      },
      { required_error: 'DEV: dashboard is required' },
    ),
  })
  .superRefine((val, ctx) => {
    if (!val.dashboard.name) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Không được để trống',
        path: ['name'],
      })
    }

    return z.NEVER
  })

export type DashboardDto = z.infer<typeof dashboardDto>
