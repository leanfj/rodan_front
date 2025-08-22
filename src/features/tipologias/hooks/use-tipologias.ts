import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import {
  TipologiasService,
  type CreateTipologiaRequest,
  type UpdateTipologiaRequest,
  type TipologiasFilters,
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
  return useQuery({
    queryKey: tipologiasKeys.list(filters || {}),
    queryFn: () => TipologiasService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para buscar tipologia por ID
export function useTipologia(id: string) {
  return useQuery({
    queryKey: tipologiasKeys.detail(id),
    queryFn: () => TipologiasService.getById(id),
    enabled: !!id, // Só executa se o ID estiver definido
  })
}

// Hook para criar tipologia
export function useCreateTipologia() {
  const queryClient = useQueryClient()

  return useMutation({
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
    onError: (error: any) => {
      toast({
        title: 'Erro ao criar tipologia',
        description:
          error?.response?.data?.message || 'Erro ao criar tipologia',
        variant: 'destructive',
      })
    },
  })
}

// Hook para atualizar tipologia
export function useUpdateTipologia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateTipologiaRequest) =>
      TipologiasService.update(data),
    onSuccess: (data) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries({ queryKey: tipologiasKeys.all })
      queryClient.invalidateQueries({
        queryKey: tipologiasKeys.detail(data.id),
      })
      toast({
        title: 'Tipologia atualizada com sucesso!',
        description: 'A tipologia foi atualizada.',
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao atualizar tipologia',
        description:
          error?.response?.data?.message || 'Erro ao atualizar tipologia',
        variant: 'destructive',
      })
    },
  })
}

// Hook para deletar tipologia
export function useDeleteTipologia() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => TipologiasService.delete(id),
    onSuccess: () => {
      // Invalida todas as queries de tipologias
      queryClient.invalidateQueries({ queryKey: tipologiasKeys.all })
      toast({
        title: 'Tipologia deletada com sucesso!',
        description: 'A tipologia foi deletada.',
        variant: 'default',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao deletar tipologia',
        description:
          error?.response?.data?.message || 'Erro ao deletar tipologia',
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
