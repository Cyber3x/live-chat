import { TUser } from "@/pages/ChatHome"
import { useContext } from "react"
import { AuthContext } from "../auth/AuthProvider"
import UserStatus from "./UserStatus"

function sortUsers(users: TUser[]): TUser[] {
  return users.sort((a, z) => {
    if (a.isOnline && !z.isOnline) {
      return -1
    } else if (!a.isOnline && z.isOnline) {
      return 1
    } else {
      return 0
    }
  })
}

type Props = {
  users: TUser[]
}

export default function ChatUsers({ users }: Props) {
  const { userData } = useContext(AuthContext)

  return (
    <div className="flex flex-col space-y-1 pb-2">
      <h1 className="text-center font-medium mb-1 px-10">Chat users</h1>
      {sortUsers(users).map(
        (user, i) =>
          userData.id !== user.id && (
            <UserStatus
              user={user}
              key={i}
              isCurrentlyOpen={user.isCurrentlyOpen}
            />
          )
      )}
    </div>
  )
}
