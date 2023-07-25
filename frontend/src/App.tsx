import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { AuthProvider } from "./components/auth/AuthProvider"
import { NoAuthOnlyRoute } from "./components/auth/NoAuthOnlyRoute"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"
import { AuthPage } from "./pages/AuthPage"
import ChatHome from "./pages/ChatHome"
import { LandingPage } from "./pages/LandingPage"
import { ChatProvider } from "./components/chat/ChatProvider"
import EmailVerifiedPage from "./pages/EmailVerifiedPage"
import { Toaster } from "./components/ui/toaster"
import EmailInputPage from "./pages/forgotPassword/EmailInputPage"
import ChangePasswordPage from "./pages/forgotPassword/ChangePasswordPage"

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
        <ChatProvider>
          <ChatHome />
        </ChatProvider>
      </ProtectedRoute>
    ),
  },
  { path: "email-verified", element: <EmailVerifiedPage /> },
  { path: "forgot-password", element: <EmailInputPage /> },
  { path: "change-password/:token", element: <ChangePasswordPage /> },
])

export default function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
