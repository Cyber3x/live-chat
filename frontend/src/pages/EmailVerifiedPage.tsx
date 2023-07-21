import { TypographyH1 } from "@/components/typography/TypographyH1"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function EmailVerifiedPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-gray-200 h-screen">
      <div className="w-[60%] mx-auto pt-24">
        <TypographyH1 className="text-teal-600 mb-10">
          Your email is sucessfully verified.
        </TypographyH1>

        <Button
          onClick={() => navigate("/login", { replace: true })}
          className="bg-teal-600 hover:bg-teal-800"
        >
          Go to Login
        </Button>
      </div>
    </div>
  )
}
