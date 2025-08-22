// Hook que automaticamente escolhe entre versão dev e produção
import type { TipologiasFilters } from '../services/tipologias.service'
import {
  useTipologias,
  useCreateTipologia,
  useUpdateTipologia,
  useDeleteTipologia,
} from './use-tipologias'
import {
  useTipologiasDev,
  useCreateTipologiaDev,
  useUpdateTipologiaDev,
  useDeleteTipologiaDev,
} from './use-tipologias-dev'

// Verifica se está em modo desenvolvimento
const isDev = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL

// Hook para buscar tipologias (auto-switch)
export function useTipologiasAuto(filters?: TipologiasFilters) {
  const prodQuery = useTipologias(filters)
  const devQuery = useTipologiasDev()

  return isDev ? devQuery : prodQuery
}

// Hook para criar tipologia (auto-switch)
export function useCreateTipologiaAuto() {
  const prodMutation = useCreateTipologia()
  const devMutation = useCreateTipologiaDev()

  return isDev ? devMutation : prodMutation
}

// Hook para atualizar tipologia (auto-switch)
export function useUpdateTipologiaAuto() {
  const prodMutation = useUpdateTipologia()
  const devMutation = useUpdateTipologiaDev()

  return isDev ? devMutation : prodMutation
}

// Hook para deletar tipologia (auto-switch)
export function useDeleteTipologiaAuto() {
  const prodMutation = useDeleteTipologia()
  const devMutation = useDeleteTipologiaDev()

  return isDev ? devMutation : prodMutation
}
