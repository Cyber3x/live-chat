import { TypographyH1 } from "@/components/typography/TypographyH1"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="mt-24 w-[60%] mx-auto">
      <TypographyH1 className="text-center">Welcome to LiveChat</TypographyH1>

      <div className="flex justify-between space-x-4 mt-52">
        <Button
          className="flex-1 bg-teal-700 hover:bg-teal-800"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
        <Button
          color="teal-700"
          className="flex-1 border-2 border-teal-700 text-teal-700"
          variant={"outline"}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </div>
    </div>
  )
}
