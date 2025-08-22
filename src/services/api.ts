import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptador de request - adiciona token de autenticação
Api.interceptors.request.use(
  (config) => {
    const { auth } = useAuthStore.getState()

    if (auth.accessToken) {
      config.headers.Authorization = `Bearer ${auth.accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptador de response - trata erros globalmente
Api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { auth } = useAuthStore.getState()

    // Se erro 401, fazer logout
    if (error.response?.status === 401) {
      auth.reset()
      toast.error('Sessão expirada. Faça login novamente.')
      // Redirecionar para login se necessário
      window.location.href = '/sign-in'
      return Promise.reject(error)
    }

    // Se erro 403, mostrar mensagem de acesso negado
    if (error.response?.status === 403) {
      toast.error('Acesso negado. Você não tem permissão para esta ação.')
      return Promise.reject(error)
    }

    // Se erro 500, mostrar mensagem genérica
    if (error.response?.status >= 500) {
      toast.error('Erro interno do servidor. Tente novamente mais tarde.')
      return Promise.reject(error)
    }

    // Para outros erros, deixar o componente tratar
    return Promise.reject(error)
  }
)
