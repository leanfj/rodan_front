import { t } from 'i18next'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn() {
  return (
    <AuthLayout>
      {({ handleToastMessage: handleMessage }) => (
        <Card className='p-6'>
          <div className='flex flex-col space-y-2 text-left'>
            <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            <p className='text-sm text-muted-foreground'>
              {t('Enter your email and password below')} <br />
              {t('to log into your account.')}
            </p>
          </div>
          <UserAuthForm onAuthMessage={handleMessage} />
        </Card>
      )}
    </AuthLayout>
  )
}
