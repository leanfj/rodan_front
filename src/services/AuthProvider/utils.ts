import { AxiosError } from 'axios'
import { Api } from '@/services/api'
import { log } from 'console'

export async function signIn(email: string, password: string) {
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
