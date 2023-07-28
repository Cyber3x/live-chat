import { PropsWithChildren, useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthProvider"

export const NoAuthOnlyRoute = ({ children }: PropsWithChildren) => {
  const { isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    return <Navigate to="/chat" replace />
  }

  return children
}
