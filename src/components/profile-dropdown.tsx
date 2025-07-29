/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { logout } from '@/services/AuthProvider/utils'
import { useTranslation } from 'react-i18next'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface User {
  userId: number
  email: string
  role: string[]
  userName: string
  login: string
}

export function ProfileDropdown() {
  const auth = useAuthStore((state) => state.auth)
  const { t } = useTranslation()

  const navigate = useNavigate()
  const location = useLocation() as { search: { from: string } }
  const { setIsLoading } = useLoading()

  const [user, setUser] = useState<User>({
    userId: 0,
    email: '',
    role: [],
    userName: '',
    login: '',
  })

  useEffect(() => {
    setUser({
      userId: auth.user?.userId || 0,
      email: auth.user?.email || '',
      role: auth.user?.roles || [],
      userName: auth.user?.userName || '',
      login: auth.user?.login || '',
    })
  }, [])

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
            <AvatarFallback>
              {user.userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              {user.userName.toUpperCase()}
            </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {t('Profile')}
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Link to='/settings'>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuItem asChild>
            <Link to='/settings'>
              {t('Settings')}
              {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          {t('Log out')}
          {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
