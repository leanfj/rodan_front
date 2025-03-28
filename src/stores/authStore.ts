import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'auth:accessToken'
const REFRESH_TOKEN = 'auth:refreshToken'
const USER_KEY = 'auth:user'

interface AuthUser {
  userId: number
  email: string
  role: string[]
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    refreshToken: string
    setAccessToken: (accessToken: string) => void
    setRefreshToken: (refreshToken: string) => void
    resetAccessToken: () => void
    resetRefreshToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const savedUser = localStorage.getItem(USER_KEY)
  const cookieAccessState = Cookies.get(ACCESS_TOKEN)
  const cookieRefreshState = Cookies.get(REFRESH_TOKEN)

  const initAccessToken = cookieAccessState ? JSON.parse(cookieAccessState) : ''
  const initRefreshToken = cookieRefreshState
    ? JSON.parse(cookieRefreshState)
    : ''

  return {
    auth: {
      user: savedUser ? JSON.parse(savedUser) : null,
      setUser: (user) =>
        set((state) => {
          if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user))
          } else {
            localStorage.removeItem(USER_KEY)
          }
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initAccessToken,
      refreshToken: initRefreshToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      setRefreshToken: (refreshToken) =>
        set((state) => {
          Cookies.set(REFRESH_TOKEN, JSON.stringify(refreshToken))
          return { ...state, auth: { ...state.auth, refreshToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      resetRefreshToken: () =>
        set((state) => {
          Cookies.remove(REFRESH_TOKEN)
          return { ...state, auth: { ...state.auth, refreshToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(REFRESH_TOKEN)
          localStorage.removeItem(USER_KEY)

          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
