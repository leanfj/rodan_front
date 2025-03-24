import { useState } from 'react'
import { toast } from 'sonner'
import { SonnerToaster } from '@/components/ui/sonner-toaster'

interface Props {
  children: (props: { handleError: (error: string) => void }) => React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const [message, setMessage] = useState<string | null>(null)

  const handleError = async (error: string) => {
    if (error) {
      setMessage(error)
    } else {
      setMessage('An error occurred')
    }

    toast.error(message)
  }

  return (
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='mr-2 h-6 w-6'
          >
            <path d='M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3' />
          </svg>
          <h1 className='text-xl font-medium'>Rodan</h1>
        </div>
        {children({ handleError })}
      </div>
      <SonnerToaster richColors duration={5000} />
    </div>
  )
}
