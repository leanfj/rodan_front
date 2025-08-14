import { createLazyFileRoute } from '@tanstack/react-router'
import Tipologias from '@/features/tipologias'

export const Route = createLazyFileRoute('/_authenticated/tipologias/')({
  component: Tipologias,
})
