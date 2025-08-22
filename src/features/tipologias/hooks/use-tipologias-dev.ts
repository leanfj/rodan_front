import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { tipologiaListSchema } from '../data/schema'
import type { Tipologia } from '../data/schema'
import { tipologias as mockTipologias } from '../data/tipologias'

// Simulação de delay para parecer real
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Versão de desenvolvimento que usa dados mockados
export function useTipologiasDev() {
  return useQuery({
    queryKey: ['tipologias', 'dev'],
    queryFn: async () => {
      await delay(1000) // Simula delay da API
      const data = tipologiaListSchema.parse(mockTipologias)
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

// Hook de criação mockado
export function useCreateTipologiaDev() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { identificacao: string; descricao: string }) => {
      await delay(500)
      const newTipologia: Tipologia = {
        id: crypto.randomUUID(),
        identificacao: data.identificacao,
        descricao: data.descricao,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      return newTipologia
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias'] })
      toast.success('Tipologia criada com sucesso! (Modo desenvolvimento)')
    },
    onError: () => {
      toast.error('Erro ao criar tipologia (simulado)')
    },
  })
}

// Hook de atualização mockado
export function useUpdateTipologiaDev() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      id: string
      identificacao: string
      descricao: string
    }) => {
      await delay(500)
      return {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias'] })
      toast.success('Tipologia atualizada com sucesso! (Modo desenvolvimento)')
    },
    onError: () => {
      toast.error('Erro ao atualizar tipologia (simulado)')
    },
  })
}

// Hook de deleção mockado
export function useDeleteTipologiaDev() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await delay(500)
      console.log('Deletando tipologia:', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tipologias'] })
      toast.success('Tipologia deletada com sucesso! (Modo desenvolvimento)')
    },
    onError: () => {
      toast.error('Erro ao deletar tipologia (simulado)')
    },
  })
}
