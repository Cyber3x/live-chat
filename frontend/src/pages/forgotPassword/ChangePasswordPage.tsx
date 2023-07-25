import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { apiPost } from "@/utils/apiFetch"

import { zodResolver } from "@hookform/resolvers/zod"
import { ToastAction } from "@radix-ui/react-toast"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { type TChangePasswrodResponse } from "@backend/controllers/auth/changePassword"
import { z } from "zod"

const FormSchemaPasswordChange = z.object({
  password: z
    .string()
    .min(8, { message: "Password needs to be at least 8 characthers" }),
  confirm: z.string().min(8),
  token: z.string(),
})

type TChangePasswordData = z.infer<typeof FormSchemaPasswordChange>

export default function ChangePasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const { toast } = useToast()

  const form = useForm<TChangePasswordData>({
    resolver: zodResolver(
      FormSchemaPasswordChange.refine(
        (data) => data.password === data.confirm,
        {
          message: "Passwords don't match",
          path: ["confirm"],
        }
      )
    ),
    defaultValues: {
      confirm: "",
      password: "",
      token,
    },
  })

  async function onSubmit(data: TChangePasswordData) {
    const res = await apiPost("/auth/change-password", data)

    if (res.status === 200) {
      toast({
        title: "Password changed successfully",
        description: "Your password has been changed. You need to login again",
        action: (
          <ToastAction
            altText="login"
            onClick={() => navigate("/login", { replace: true })}
          >
            Login
          </ToastAction>
        ),
      })
    } else {
      const errorData = (await res.json()) as TChangePasswrodResponse
      form.setError("password", { message: errorData.message })
    }
  }

  return (
    <div className="flex justify-center pt-72">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Enter your new password</CardTitle>
          <CardDescription>
            This will change your password. Please remember the new one.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        autoFocus
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="••••••••"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  type="reset"
                  onClick={() => navigate("/login")}
                >
                  Back
                </Button>
                <Button type="submit">Reset</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
