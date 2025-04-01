import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate } from '@tanstack/react-router'
import { signIn } from '@/services/AuthProvider/utils'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { MessageType } from '@/utils/enums'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = {
  className?: string
  onAuthMessage?: (message: string, type: MessageType) => void
} & HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: t('Please enter your email') })
    .email({ message: t('Invalid email address') }),
  password: z.string().min(1, {
    message: t('Please enter your password'),
  }),
})

export function UserAuthForm({
  onAuthMessage,
  className,
  ...props
}: UserAuthFormProps) {
  const { t, i18n } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation() as { search: { from: string } }
  const from = location.search.from || '/'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { setUser, setAccessToken, setRefreshToken } = useAuthStore(
    (state) => state.auth
  )

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await signIn(data.email, data.password)

      setUser({
        userId: response.user.userId,
        email: response.user.email,
        login: response.user.login,
        userName: response.user.userName,
        role: ['admin'],
      })
      setAccessToken(response.accessToken)
      setRefreshToken(response.refreshToken)

      navigate({
        to: from,
        replace: true,
      })

      setTimeout(() => {
        setIsLoading(false)
      }, 3000)
    } catch (error: Error | unknown) {
      setIsLoading(false)

      onAuthMessage?.(
        error instanceof Error
          ? error.message
          : t('An error occurred. Please try again later.'),
        MessageType.Error
      )
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              Login
            </Button>

            {/* <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandGithub className='h-4 w-4' /> GitHub
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                disabled={isLoading}
              >
                <IconBrandFacebook className='h-4 w-4' /> Facebook
              </Button>
            </div> */}
          </div>
        </form>
      </Form>
    </div>
  )
}
