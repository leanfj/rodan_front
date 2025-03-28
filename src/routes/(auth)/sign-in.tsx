import { createFileRoute, redirect } from '@tanstack/react-router'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  beforeLoad: ({ context, location }) => {
    const user = context.authStore.getState().auth.user
    if (user) {
      throw redirect({
        to: '/',
      })
    }
  },
})
