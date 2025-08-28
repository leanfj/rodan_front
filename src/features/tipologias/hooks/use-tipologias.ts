import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { Tipologia } from '../data/schema'
import {
  TipologiasService,
  type CreateTipologiaRequest,
  type UpdateTipologiaRequest,
  type TipologiasFilters,
  type TipologiasResponse,
} from '../services/tipologias.service'

// Query keys para tipologias
export const tipologiasKeys = {
  all: ['tipologias'] as const,
  lists: () => [...tipologiasKeys.all, 'list'] as const,
  list: (filters: TipologiasFilters) =>
    [...tipologiasKeys.lists(), filters] as const,
  details: () => [...tipologiasKeys.all, 'detail'] as const,
  detail: (id: string) => [...tipologiasKeys.details(), id] as const,
}

// Hook para buscar todas as tipologias
export function useTipologias(filters?: TipologiasFilters) {
  return useQuery<TipologiasResponse, AxiosError>({
    queryKey: tipologiasKeys.list(filters || {}),
    queryFn: () => TipologiasService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para buscar tipologia por ID
export function useTipologia(id: string) {
  return useQuery<Tipologia, AxiosError>({
    queryKey: tipologiasKeys.detail(id),
    queryFn: () => TipologiasService.getById(id),
    enabled: !!id, // Só executa se o ID estiver definido
  })
}

// Hook para criar tipologia
export function useCreateTipologia() {
  const queryClient = useQueryClient()

  return useMutation<Tipologia, AxiosError, CreateTipologiaRequest>({
    mutationFn: (data: CreateTipologiaRequest) =>
      TipologiasService.create(data),
    onSuccess: () => {
      // Invalida todas as queries de tipologias
      queryClient.invalidateQueries({ queryKey: tipologiasKeys.all })
      toast({
        title: 'Tipologia criada com sucesso!',
        description: 'A nova tipologia foi criada.',
        variant: 'default',
      })
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || 'Erro ao criar tipologia'
      toast({
        title: 'Erro ao criar tipologia',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

// Hook para atualizar tipologia
export function useUpdateTipologia() {
  const queryClient = useQueryClient()

  return useMutation<Tipologia, AxiosError, UpdateTipologiaRequest>({
    mutationFn: (data: UpdateTipologiaRequest) =>
      TipologiasService.update(data),
    onSuccess: () => {
      // Invalida todas as queries de tipologias
      queryClient.invalidateQueries({ queryKey: tipologiasKeys.all })
      toast({
        title: 'Tipologia atualizada com sucesso!',
        description: 'As alterações foram salvas.',
        variant: 'default',
      })
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || 'Erro ao atualizar tipologia'
      toast({
        title: 'Erro ao atualizar tipologia',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

// Hook para deletar tipologia
export function useDeleteTipologia() {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError, string>({
    mutationFn: (id: string) => TipologiasService.delete(id),
    onSuccess: () => {
      // Invalida todas as queries de tipologias
      queryClient.invalidateQueries({ queryKey: tipologiasKeys.all })
      toast({
        title: 'Tipologia deletada com sucesso!',
        description: 'A tipologia foi removida.',
        variant: 'default',
      })
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as any)?.message || 'Erro ao deletar tipologia'
      toast({
        title: 'Erro ao deletar tipologia',
        description: errorMessage,
        variant: 'destructive',
      })
    },
  })
}

// Hook para busca de tipologias
export function useSearchTipologias(query: string) {
  return useQuery({
    queryKey: [...tipologiasKeys.all, 'search', query],
    queryFn: () => TipologiasService.search(query),
    enabled: query.length > 2, // Só busca se tiver mais de 2 caracteres
    staleTime: 30 * 1000, // 30 segundos para search
  })
}
