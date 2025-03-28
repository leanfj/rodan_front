import { Link } from '@tanstack/react-router'
import { t } from 'i18next'
import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export default function SignUp() {
  return (
    <AuthLayout>
      {({ handleToastMessage: handleMessage }) => (
        <Card className='p-6'>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className='text-lg font-semibold tracking-tight'>
              {t('Create an account')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('Enter your email and password to create an account.')} <br />
              {t('Already have an account?')}{' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                {t('Sign In')}
              </Link>
            </p>
          </div>
          <SignUpForm onAuthMessage={handleMessage} />
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            {t('By creating an account, you agree to our')}{' '}
            <a
              href='/terms'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('Terms of Service')}
            </a>{' '}
            and{' '}
            <a
              href='/privacy'
              className='underline underline-offset-4 hover:text-primary'
            >
              {t('Privacy Policy')}
            </a>
            .
          </p>
        </Card>
      )}
    </AuthLayout>
  )
}
