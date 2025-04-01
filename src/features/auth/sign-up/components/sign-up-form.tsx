import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { signUp } from '@/services/AuthProvider/utils'
import { t } from 'i18next'
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

type SignUpFormProps = {
  className?: string
  onAuthMessage?: (message: string, type: MessageType) => void
} & HTMLAttributes<HTMLDivElement>

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: t('Please enter your email') })
      .email({ message: t('Invalid email address') }),
    password: z
      .string()
      .min(1, {
        message: t('Please enter your password'),
      })
      .min(7, {
        message: t('Password must be at least 7 characters long'),
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("Passwords don't match."),
    path: ['confirmPassword'],
  })

export function SignUpForm({
  onAuthMessage,
  className,
  ...props
}: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation() as { search: { from: string } }
  const from = location.search.from || '/'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const reponse = await signUp(
        data.email,
        data.password,
        data.confirmPassword
      )

      if (reponse) {
        onAuthMessage?.(t('Account created successfully'), MessageType.Success)
        onAuthMessage?.(
          t('Wait for your User to be Activated'),
          MessageType.Warning
        )

        form.reset()

        setTimeout(() => {
          navigate({
            to: '/sign-in',
            search: { from: '/sign-up' },
            replace: true,
          })
        }, 5000)
      }
    } catch (error: Error | unknown) {
      onAuthMessage?.(
        error instanceof Error
          ? error.message
          : t('An error occurred. Please try again later.'),
        MessageType.Error
      )
    }

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
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
                  <FormLabel>{t('Password')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>{t('Confirm Password')}</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' disabled={isLoading}>
              {t('Create Account')}
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
