/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { AuthContext } from "@/components/auth/AuthProvider"
import { HTMLInputTypeAttribute, useContext } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

type Props = {
  selectedTab: "register" | "login"
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const registerSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    // username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  })

export type TRegisterData = z.infer<typeof registerSchema>
export type TLoginData = z.infer<typeof loginSchema>

type TFormFieldData = {
  lable: string
  type: HTMLInputTypeAttribute
  placeholder?: string
}

type TRegisterFieldsData = { [K in keyof TRegisterData]: TFormFieldData }
type TLoginFieldsData = { [K in keyof TLoginData]: TFormFieldData }

const registerFieldsData: TRegisterFieldsData = {
  firstName: {
    type: "text",
    lable: "First name",
    placeholder: "Pedro",
  },
  lastName: {
    lable: "Last name",
    placeholder: "Darido",
    type: "text",
  },
  // username: {
  //   lable: "Username",
  //   placeholder: "@pedrodario",
  //   type: "text",
  // },
  email: {
    lable: "Email",
    placeholder: "pedro.dario@domain.com",
    type: "text",
  },
  password: {
    lable: "Password",
    placeholder: "••••••••",
    type: "password",
  },
  confirm: {
    lable: "Confirm password",
    placeholder: "••••••••",
    type: "password",
  },
}

const loginFieldsData: TLoginFieldsData = {
  email: {
    type: "text",
    lable: "Email",
    placeholder: "pedro.dario@domain.com",
  },
  password: {
    type: "password",
    lable: "Password",
    placeholder: "••••••••",
  },
}

function RegisterForm() {
  const form = useForm<TRegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      confirm: "",
      email: "",
      password: "",
      // username: "",
    },
  })

  function onSubmit(value: TRegisterData) {
    console.log(value)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {Object.entries(registerFieldsData).map(([name, data]) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof TRegisterFieldsData}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{data.lable}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data.placeholder}
                    {...field}
                    type={data.type}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="px-10">
          Register
        </Button>
      </form>
    </Form>
  )
}

function LoginForm() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const form = useForm<TLoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
    },
  })

  async function onSubmit(data: TLoginData) {
    const response = await login(data)
    if (response.ok) {
      navigate("/chat")
    } else {
      console.log("erorrrror")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {Object.entries(loginFieldsData).map(([name, data]) => (
          <FormField
            key={name}
            control={form.control}
            name={name as keyof TLoginFieldsData}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{data.lable}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={data.placeholder}
                    {...field}
                    type={data.type}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" className="px-10">
          Register
        </Button>
      </form>
    </Form>
  )
}

export function AuthPage(props: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center p-72 h-screen">
      <Tabs defaultValue={props.selectedTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register" onClick={() => navigate("/register")}>
            Register
          </TabsTrigger>
          <TabsTrigger value="login" onClick={() => navigate("/login")}>
            Login
          </TabsTrigger>
        </TabsList>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Create new account and chat with friends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login and chat with your friends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
