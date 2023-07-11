import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { AuthProvider } from "./components/auth/AuthProvider"
import { NoAuthOnlyRoute } from "./components/auth/NoAuthOnlyRoute"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthPage } from "./pages/AuthPage"
import ChatHome from "./pages/ChatHome"
import { LandingPage } from "./pages/LandingPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <h1>404</h1>,
  },
  {
    path: "login",
    element: (
      <NoAuthOnlyRoute>
        <AuthPage selectedTab="login" />
      </NoAuthOnlyRoute>
    ),
  },
  {
    path: "register",
    element: (
      <NoAuthOnlyRoute>
        <AuthPage selectedTab="register" />
      </NoAuthOnlyRoute>
    ),
  },
  {
    path: "chat",
    element: (
      <ProtectedRoute>
        <ChatHome />
      </ProtectedRoute>
    ),
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
