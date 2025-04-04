import Cookies from 'js-cookie'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { useLoading } from '@/context/loading-context'
import { SearchProvider } from '@/context/search-context'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'

export const Route = createFileRoute('/_authenticated')({
  component: () => <RouteComponent />,
  beforeLoad: ({ context, location }) => {
    const user = context.authStore.getState().auth.user
    if (!user) {
      throw redirect({
        to: '/sign-in',
        search: {
          from: location.pathname,
        },
      })
    }
  },
})

interface LoadingOverlayProps {
  isLoading: boolean
}

function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
        'cursor-not-allowed'
      )}
    >
      <div className='flex flex-col items-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent'></div>
        <p className='mt-4 text-white'>Carregando...</p>
      </div>
    </div>
  )
}

function RouteComponent() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <>
      <LoadingOverlay isLoading={useLoading().isLoading} />
      <SearchProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <SkipToMain />
          <AppSidebar />
          <div
            id='content'
            className={cn(
              'ml-auto w-full max-w-full',
              'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
              'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
              'transition-[width] duration-200 ease-linear',
              'flex h-svh flex-col',
              'group-data-[scroll-locked=1]/body:h-full',
              'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
            )}
          >
            <Outlet />
          </div>
        </SidebarProvider>
      </SearchProvider>
    </>
  )
}
