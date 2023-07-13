import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { TChatUser } from "./ChatProvider"

type Props = {
  user: TChatUser
  isCurrentlyOpen?: boolean
  onClick?: () => void
}

export default function UserStatus({ user, isCurrentlyOpen, onClick }: Props) {
  const { isOnline, firstName, lastName } = user

  return (
    <Button
      onClick={onClick}
      variant={isCurrentlyOpen ? "default" : "secondary"}
      className={cn(
        "flex justify-between items-center hover:bg-teal-800 hover:text-white space-x-6",
        isCurrentlyOpen && "bg-teal-700"
      )}
      disabled={!isOnline}
    >
      <p className={cn(isCurrentlyOpen && "text-white")}>
        {firstName + " " + lastName}
      </p>
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          isOnline ? "bg-green-600" : "bg-red-300"
        )}
      />
    </Button>
  )
}
