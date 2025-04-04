import { Outlet } from '@tanstack/react-router'
import {
  IconBrowserCheck,
  IconNotification,
  IconPalette,
  IconTool,
  IconUser,
} from '@tabler/icons-react'
import { t as translate } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  const { t } = useTranslation()
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            {t('Settings')}
          </h1>
          <p className='text-muted-foreground'>
            {t('Manage your account settings and set e-mail preferences.')}
          </p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1 pr-4'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: translate('Profile'),
    icon: <IconUser size={18} />,
    href: '/settings',
  },
  {
    title: translate('Account'),
    icon: <IconTool size={18} />,
    href: '/settings/account',
  },
  {
    title: translate('Appearance'),
    icon: <IconPalette size={18} />,
    href: '/settings/appearance',
  },
  {
    title: translate('Notifications'),
    icon: <IconNotification size={18} />,
    href: '/settings/notifications',
  },
  {
    title: translate('Display'),
    icon: <IconBrowserCheck size={18} />,
    href: '/settings/display',
  },
]
