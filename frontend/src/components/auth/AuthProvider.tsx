import { TLoginData } from "@/pages/AuthPage"
import { apiPost } from "@/utils/apiFetch"
import { PropsWithChildren, createContext, useState } from "react"

type TStatusResponse = { ok: boolean }

interface IAuthContext {
  isAuthenticated: boolean
  token: string
  login: (data: TLoginData) => Promise<TStatusResponse>
  logout: () => void
}

export const AuthContext = createContext<IAuthContext>(null!)

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [token, setToken] = useState<string>("")

  // Function to log in a user
  const login = async (data: TLoginData) => {
    const response = await apiPost("/auth/login", data)

    const responseData = (await response.json()) as {
      token?: string
      message: string
      error?: unknown
    }
    if (response.status === 200) {
      setIsAuthenticated(true)
      setToken(responseData.token!)
      return { ok: true }
    }

    return { ok: false }
  }

  // Function to log out a user
  // TODO: hit api logout endpoint to change isLogged value on user entity
  const logout = () => {
    setToken("")
    setIsAuthenticated(false)
  }

  const value = { isAuthenticated, login, logout, token }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
