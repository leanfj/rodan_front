import { Api } from '@/services/api'

export async function signIn(email: string, password: string) {
  try {
    const request = await Api.post('api/login', {
      email,
      password,
    })

    return request.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}
