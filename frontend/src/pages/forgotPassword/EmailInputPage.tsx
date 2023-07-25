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
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { type TForgotPasswordResponseError } from "@backend/controllers/auth/sendForgotPasswordEmail"
import { z } from "zod"

const FormSchemaMailInput = z.object({
  email: z.string().email(),
})
type TMailInputData = z.infer<typeof FormSchemaMailInput>

export default function EmailInputPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<TMailInputData>({
    resolver: zodResolver(FormSchemaMailInput),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: TMailInputData) {
    const res = await apiPost("/auth/forgot-password", data)

    if (res.status === 200) {
      toast({
        title: "Email sent",
        description:
          "An email with password reset link has been sent to you email.",
      })
    } else {
      const { message } = (await res.json()) as TForgotPasswordResponseError

      form.setError("email", { message })
    }
  }

  return (
    <div className="flex justify-center pt-72">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Enter your email</CardTitle>
          <CardDescription>
            We'll send you a link so you can reset your password.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@domain.com"
                        {...field}
                        autoFocus
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
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
