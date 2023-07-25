import { cn } from "@/lib/utils"
import ChatRoomSrvModel from "@backend/sockets/ChatRoomSrvModel"
import { useContext, useEffect, useState } from "react"
import { Button } from "../ui/button"
import { ChatContext } from "./ChatProvider"

type Props = {
  chatRoom: ChatRoomSrvModel
}

export default function ChatRoomButton({ chatRoom }: Props) {
  const { openedChatRoomId, openChatRoom, unreadMessages } =
    useContext(ChatContext)

  const { id, name } = chatRoom

  const [numberOfUnreadMessages, setNumberOfUnreadMessages] = useState(0)

  useEffect(() => {
    setNumberOfUnreadMessages(unreadMessages.get(id) ?? 0)
  }, [unreadMessages, id])

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
      {numberOfUnreadMessages ? (
        numberOfUnreadMessages > 0 ? (
          <p className="text-xs rounded-full bg-teal-700 w-6 h-6 text-white shadow-sm flex justify-center items-center">
            {numberOfUnreadMessages > 99 ? "99+" : numberOfUnreadMessages}
          </p>
        ) : null
      ) : null}
    </Button>
  )
}
