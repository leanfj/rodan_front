import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { t as translate } from 'i18next'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const profileFormSchema = z.object({
  userName: z
    .string()
    .min(2, {
      message: translate('Username must be at least 2 characters.'),
    })
    .max(30, {
      message: translate('Username must not be longer than 30 characters.'),
    }),
  email: z
    .string({
      required_error: translate('Please select an email to display.'),
    })
    .email(),
  role: z.array(z.string()).min(1, {
    message: translate('Please select at least one role.'),
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export interface User {
  userId: number
  email: string
  role: string[]
  userName: string
  login: string
}

const defaultValues: Partial<ProfileFormValues> = {
  userName: '',
  email: '',
  role: ['admin', 'user'],
}

export default function ProfileForm() {
  const { t } = useTranslation()
  const auth = useAuthStore((state) => state.auth)
  const [roles, setRoles] = useState<string[]>([''])
  const [, setUser] = useState<User>({
    userId: 0,
    email: '',
    role: [],
    userName: '',
    login: '',
  })

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  useEffect(() => {
    setUser({
      userId: auth.user?.userId || 0,
      email: auth.user?.email || '',
      role: auth.user?.roles || [],
      userName: auth.user?.userName || '',
      login: auth.user?.login || '',
    })

    form.reset({
      userName: auth.user?.userName || '',
      email: auth.user?.email || '',
      role: auth.user?.roles || [],
    })

    const fetchRoles = async () => {
      const fetchedRoles = ['administrador', 'usuario', 'editor']
      setRoles(fetchedRoles)
    }

    fetchRoles()
  }, [])

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: t('You submitted the following values:'),
      description: (
        <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
          <code className='text-white'>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='userName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder={t('User Name')} {...field} />
              </FormControl>
              <FormDescription>
                {t(
                  'This is your public display name. It can be your real name or a'
                )}{' '}
                {t('pseudonym. You can only change this once every 30 days.')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='Email' {...field} />
              </FormControl>
              <FormDescription>
                {t(
                  'You can manage verified email addresses in your email settings.'
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('Roles')}</FormLabel>
              <FormControl>
                <div className='space-y-2'>
                  {roles.map((role) => (
                    <div key={role} className='flex items-center space-x-3'>
                      <Checkbox
                        id={role}
                        checked={field.value.includes(role)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, role])
                          } else {
                            field.onChange(
                              field.value.filter((value) => value !== role)
                            )
                          }
                        }}
                      />
                      <label htmlFor={role} className='text-sm font-medium'>
                        {role.toUpperCase()}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                {t('You can manage your roles in your profile settings.')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('Tell us a little bit about yourself')}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {t('You can ')}
                <span>@mention</span>
                {t(' other users and organizations to')} {t('link to them.')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`role.${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    {t(
                      'Add links to your website, blog, or social media profiles.'
                    )}
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            {t('Add URL')}
          </Button>
        </div> */}
        <Button type='submit'>{t('Update profile')}</Button>
      </form>
    </Form>
  )
}
