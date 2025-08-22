import { useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/tipologias-columns'
import { TipologiasDialogs } from './components/tipologias-dialogs'
import { TipologiasPrimaryButtons } from './components/tipologias-primary-buttons'
import { TipologiasTable } from './components/tipologias-table'
import TipologiasProvider from './context/tipologias-context'
import { useTipologiasAuto } from './hooks/use-tipologias-auto'
import type { TipologiasFilters } from './services/tipologias.service'

export default function Tipologias() {
  // Estado para filtros e paginação (para uso futuro)
  const [filters] = useState<TipologiasFilters>({
    page: 1,
    limit: 10,
  })

  // Verifica se está em modo desenvolvimento
  const isDev = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL

  // Usa hook automático que escolhe entre dev e produção
  const {
    data: tipologiasResponse,
    isLoading,
    isError,
    error,
  } = useTipologiasAuto(filters)

  // Função para atualizar filtros (para uso futuro com paginação)
  // const handleFiltersChange = (newFilters: Partial<TipologiasFilters>) => {
  //   setFilters((prev) => ({ ...prev, ...newFilters }))
  // }

  // Função para busca que pode ser usada futuramente
  // const handleSearch = (search: string) => {
  //   handleFiltersChange({ search, page: 1 })
  // }

  if (isError) {
    toast({
      title: 'Erro ao carregar tipologias',
      description: error?.message || 'Ocorreu um erro inesperado',
      variant: 'destructive',
    })
  }

  return (
    <TipologiasProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tipologias</h2>
            <p className='text-muted-foreground'>
              Controle as tipologias aqui.
              {isDev && (
                <span className='ml-2 text-sm text-blue-600'>
                  (Modo desenvolvimento - dados mockados)
                </span>
              )}
            </p>
          </div>
          <TipologiasPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {isLoading ? (
            <div className='flex h-32 items-center justify-center'>
              <div className='text-muted-foreground'>
                Carregando tipologias...
              </div>
            </div>
          ) : (
            <TipologiasTable
              data={tipologiasResponse?.data || []}
              columns={columns}
            />
          )}
        </div>
      </Main>

      <TipologiasDialogs />
    </TipologiasProvider>
  )
}
