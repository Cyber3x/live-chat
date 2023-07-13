import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { ChatContext } from "./ChatProvider"
import { useContext } from "react"

type Props = {
  name: string
  id: number
}

export default function ChatRoomButton({ name, id }: Props) {
  const { openedChatRoomId, openChatRoom } = useContext(ChatContext)

  return (
    <Button
      variant={"secondary"}
      className={cn(
        "flex justify-between items-center hover:bg-teal-900 hover:text-white",
        openedChatRoomId === id && "bg-teal-700"
      )}
      onClick={() => openChatRoom(id)}
    >
      <p className={cn(openedChatRoomId === id && "text-white")}>{name}</p>
    </Button>
  )
}
