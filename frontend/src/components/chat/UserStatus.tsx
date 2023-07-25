import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { TChatUser } from "./ChatProvider"
import { useContext } from "react"
import { AuthContext } from "../auth/AuthProvider"

type Props = {
  user: TChatUser
  onClick?: () => void
}

export default function UserStatus({ user, onClick }: Props) {
  const { userData } = useContext(AuthContext)
  const { isOnline, firstName, lastName } = user

  return (
    <Button
      onClick={onClick}
      variant={"secondary"}
      className={cn(
        "flex justify-between items-center hover:bg-teal-800 hover:text-white space-x-6",
        user.id === userData.id && "bg-gray-200"
      )}
      disabled={!isOnline}
    >
      <p>{firstName + " " + lastName}</p>
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-green-600" : "bg-red-300"
        )}
      />
    </Button>
  )
}
