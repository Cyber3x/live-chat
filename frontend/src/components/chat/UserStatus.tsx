import { TUser } from "@/pages/ChatHome"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

type Props = {
  user: TUser
  isCurrentlyOpen?: boolean
}

export default function UserStatus({ user, isCurrentlyOpen }: Props) {
  const { isOnline, firstName, lastName } = user

  return (
    <Button
      variant={isCurrentlyOpen ? "default" : "ghost"}
      className={cn(
        "flex justify-between pr-6 items-center hover:bg-gray-200",
        isCurrentlyOpen && "bg-gray-700"
      )}
      disabled={!isOnline}
    >
      <p className={cn(isCurrentlyOpen && "text-white")}>
        {firstName + " " + lastName}
      </p>
      <div
        className={cn(
          "w-2 h-2 rounded-full ml-12",
          isOnline ? "bg-green-600" : "bg-red-300"
        )}
      />
    </Button>
  )
}
