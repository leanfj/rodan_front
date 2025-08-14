import { z } from 'zod'

const tipologiaStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type TipologiaStatus = z.infer<typeof tipologiaStatusSchema>

const tipologiaRoleSchema = z.union([
  z.literal('superadmin'),
  z.literal('admin'),
  z.literal('cashier'),
  z.literal('manager'),
])

const tipologiaSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  status: tipologiaStatusSchema,
  role: tipologiaRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Tipologia = z.infer<typeof tipologiaSchema>

export const tipologiaListSchema = z.array(tipologiaSchema)
