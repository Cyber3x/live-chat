import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { useContext, useState } from "react"
import { Button } from "../ui/button"
import { ChatContext } from "./ChatProvider"
import ChatRoomButton from "./ChatRoomButton"
import CreateChatRoomDialog from "./CreateChatRoomDialog"
import UserStatus from "./UserStatus"
import { TUserMinimal } from "@backend/sockets/eventTypes"

function sortUsers(users: TUserMinimal[]): TUserMinimal[] {
  return users.sort((a, z) => {
    if (a.isOnline && !z.isOnline) {
      return -1
    } else if (!a.isOnline && z.isOnline) {
      return 1
    } else {
      return a.firstName.localeCompare(z.firstName)
    }
  })
}

export default function ChatSidebar() {
  const { chatRooms, currentChatRoom, getUserById, users } =
    useContext(ChatContext)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="flex flex-col space-y-2">
        <DialogTrigger asChild>
          <Button variant={"outline"}>
            New chat
            <PlusIcon className="h-4 w-4 ml-4" />
          </Button>
        </DialogTrigger>
        <h1 className="text-center font-medium text-teal-700">Chat rooms</h1>
        {chatRooms.map((chatRoom, i) => (
          <ChatRoomButton chatRoom={chatRoom} key={i} />
        ))}

        <h1 className="text-center font-medium text-teal-700">
          {currentChatRoom === null ? "All users" : "Room users"}
        </h1>
        {sortUsers(
          currentChatRoom === null
            ? users
            : currentChatRoom.userIds.map(getUserById)
        ).map((user, i) => (
          <UserStatus user={user} key={i} />
        ))}
      </div>

      <CreateChatRoomDialog closeDialog={() => setIsDialogOpen(false)} />
    </Dialog>
  )
}
