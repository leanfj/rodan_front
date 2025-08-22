import { Api } from '@/services/api'
import { Tipologia, tipologiaListSchema, tipologiaSchema } from '../data/schema'

// Tipos para requests
export interface CreateTipologiaRequest {
  identificacao: string
  descricao: string
}

export interface UpdateTipologiaRequest {
  id: string
  identificacao: string
  descricao: string
}

export interface TipologiasFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface TipologiasResponse {
  data: Tipologia[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Service class para tipologias
export class TipologiasService {
  private static baseUrl = '/tipologias'

  // Buscar todas as tipologias com filtros opcionais
  static async getAll(
    filters?: TipologiasFilters
  ): Promise<TipologiasResponse> {
    const params = new URLSearchParams()

    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.search) params.append('search', filters.search)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)

    const response = await Api.get(`${this.baseUrl}?${params}`)

    // Valida a resposta com Zod
    const validatedData = tipologiaListSchema.parse(
      response.data.data || response.data
    )

    return {
      data: validatedData,
      total: response.data.total || validatedData.length,
      page: response.data.page || 1,
      limit: response.data.limit || validatedData.length,
      totalPages: response.data.totalPages || 1,
    }
  }

  // Buscar tipologia por ID
  static async getById(id: string): Promise<Tipologia> {
    const response = await Api.get(`${this.baseUrl}/${id}`)
    return tipologiaSchema.parse(response.data)
  }

  // Criar nova tipologia
  static async create(data: CreateTipologiaRequest): Promise<Tipologia> {
    const response = await Api.post(this.baseUrl, data)
    return tipologiaSchema.parse(response.data)
  }

  // Atualizar tipologia
  static async update(data: UpdateTipologiaRequest): Promise<Tipologia> {
    const { id, ...updateData } = data
    const response = await Api.put(`${this.baseUrl}/${id}`, updateData)
    return tipologiaSchema.parse(response.data)
  }

  // Deletar tipologia
  static async delete(id: string): Promise<void> {
    await Api.delete(`${this.baseUrl}/${id}`)
  }

  // Buscar tipologias com busca de texto
  static async search(query: string): Promise<Tipologia[]> {
    const response = await this.getAll({ search: query })
    return response.data
  }
}
