import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { ChatContext } from "./ChatProvider"
import { useContext } from "react"

type Props = {
  name: string
  id: number
  numOfUnreadMessages?: number
}

export default function ChatRoomButton({
  name,
  id,
  numOfUnreadMessages,
}: Props) {
  const { openedChatRoomId, openChatRoom } = useContext(ChatContext)

  return (
    <Button
      variant={"secondary"}
      className={cn(
        "flex justify-between items-center w-52 space-x-4 hover:bg-teal-900 hover:text-white",
        openedChatRoomId === id && "bg-teal-700 shadow-sm"
      )}
      onClick={() => openChatRoom(id)}
    >
      <p className={cn(openedChatRoomId === id && "text-white")}>{name}</p>
      {numOfUnreadMessages && (
        <p className="text-xs rounded-full bg-teal-700 w-6 h-6 text-white shadow-sm flex justify-center items-center">
          {numOfUnreadMessages > 99 ? "99+" : numOfUnreadMessages}
        </p>
      )}
    </Button>
  )
}
