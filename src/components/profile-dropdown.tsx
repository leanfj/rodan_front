import { useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { logout } from '@/services/AuthProvider/utils'
import { useAuthStore } from '@/stores/authStore'
import { useLoading } from '@/context/loading-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ProfileDropdown() {
  const auth = useAuthStore((state) => state.auth)

  const navigate = useNavigate()
  const location = useLocation() as { search: { from: string } }
  const { setIsLoading } = useLoading()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function signOut(event: any): Promise<void> {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (auth.user?.userId) {
        const reponse = await logout(auth.user.userId)

        if (reponse) {
          auth.reset()
        }

        setIsLoading(false)

        navigate({
          to: '/sign-in',
          search: { from: location.search.from || '/' },
        })
      }
    } catch (error: Error | unknown) {
      console.error(error)
    }

    setTimeout(() => {}, 3000)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
          <Avatar className='h-8 w-8'>
            <AvatarImage src='/avatars/01.png' alt='@shadcn' />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>satnaing</p>
            <p className='text-xs leading-none text-muted-foreground'>
              satnaingdev@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
