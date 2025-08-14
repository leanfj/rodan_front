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
import { tipologiaListSchema } from './data/schema'
import { tipologias } from './data/tipologias'

export default function Tipologias() {
  // Parse tipologia list
  const tipologiaList = tipologiaListSchema.parse(tipologias)

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
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your tipologias and their roles here.
            </p>
          </div>
          <TipologiasPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <TipologiasTable data={tipologiaList} columns={columns} />
        </div>
      </Main>

      <TipologiasDialogs />
    </TipologiasProvider>
  )
}
