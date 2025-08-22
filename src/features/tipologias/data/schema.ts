import { z } from 'zod'

export const tipologiaSchema = z.object({
  id: z.string(),
  identificacao: z.string(),
  descricao: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Tipologia = z.infer<typeof tipologiaSchema>

export const tipologiaListSchema = z.array(tipologiaSchema)
