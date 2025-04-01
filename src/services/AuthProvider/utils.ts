import { AxiosError } from 'axios'
import { Api } from '@/services/api'

export async function signIn(
  email: string,
  password: string
): Promise<{
  accessToken: string
  refreshToken: string
  user: {
    userId: number
    email: string
    login: string
    userName: string
  }
}> {
  try {
    const request = await Api.post('authentication/login', {
      email,
      password,
    })

    return request.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error(String(error))
    }
  }
}

export async function signUp(
  email: string,
  password: string,
  passwordConfirm: string
) {
  try {
    const request = await Api.post('users/register', {
      email,
      password,
      passwordConfirm,
    })

    return request.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error(String(error))
    }
  }
}

export async function logout(userId: number) {
  try {
    const request = await Api.post('authentication/logout', {
      userId,
    })

    return request.data
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.message)
    } else {
      throw new Error(String(error))
    }
  }
}
