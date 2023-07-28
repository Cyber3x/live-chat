import { TLoginData, TRegisterData } from "@/pages/AuthPage"
import { apiPost } from "@/utils/apiFetch"
import { PropsWithChildren, createContext, useState } from "react"
import { redirect } from "react-router-dom"

import {
  TUserData,
  type TLoginResponseError,
  type TLoginResponseOK,
} from "@backend/controllers/auth/login"

import {
  type TRegisterResponseError,
  type TRegisterResponseOK,
} from "@backend/controllers/auth/register"

type TLoginStatusResponse =
  | { ok: true }
  | {
      ok: false
      target: keyof TLoginData
      message: string
    }

type TRegisterStatusResponse =
  | { ok: true }
  | {
      ok: false
      target: keyof TRegisterData
      message: string
    }

type IAuthContext = {
  isAuthenticated: boolean
  token: string
  userData: TUserData

  login: (data: TLoginData) => Promise<TLoginStatusResponse>
  register: (data: TRegisterData) => Promise<TRegisterStatusResponse>
  logout: () => void
  getUserFullName: () => string
}

export const AuthContext = createContext<IAuthContext>(null!)

// AuthProvider component
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [token, setToken] = useState<string>("")
  const [userData, setUserData] = useState<TUserData>(null!)

  // Function to log in a user
  const login = async (data: TLoginData): Promise<TLoginStatusResponse> => {
    const response = await apiPost("/auth/login", data)

    if (response.status === 200) {
      const { token, userData } = (await response.json()) as TLoginResponseOK

      setIsAuthenticated(true)
      setToken(token)
      setUserData(userData)

      return { ok: true }
    }

    const { message, type } = (await response.json()) as TLoginResponseError

    let target: keyof TLoginData

    switch (type) {
      case "auth/email-not-found":
        target = "email"
        break
      case "auth/incorrect-password":
        target = "password"
        break
      case "token/error-while-creating":
        target = "password"
        break
    }

    return { ok: false, target, message }
  }

  const register = async (
    data: TRegisterData
  ): Promise<TRegisterStatusResponse> => {
    const response = await apiPost("/auth/register", data)

    if (response.status === 201) {
      const { token, userData } = (await response.json()) as TRegisterResponseOK

      setIsAuthenticated(true)
      setToken(token)
      setUserData(userData)

      return { ok: true }
    }

    const { message, type } = (await response.json()) as TRegisterResponseError

    let target: keyof TRegisterData

    switch (type) {
      case "auth/email-not-found":
        target = "email"
        break
      case "auth/user-already-exists":
        target = "email"
        break
      case "token/error-while-creating":
        target = "password"
        break
    }

    return { ok: false, target, message }
  }

  const getUserFullName = () => `${userData.firstName} ${userData.lastName}`

  // Function to log out a user
  // TODO: hit api logout endpoint to change isLogged value on user entity
  const logout = () => {
    setToken("")
    setIsAuthenticated(false)
    setUserData(null!)
    redirect("/")
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    register,
    token,
    userData,
    getUserFullName,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
