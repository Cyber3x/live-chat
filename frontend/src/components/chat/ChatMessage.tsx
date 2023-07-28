import { cn } from "@/lib/utils"
import { AuthContext } from "../auth/AuthProvider"
import { useContext } from "react"
import { TMessage } from "@backend/sockets/eventTypes"
import { ChatContext } from "./ChatProvider"

type Props = {
  message: TMessage
}

export default function ChatMessage({ message }: Props) {
  const { message: messageText, senderId } = message
  const { userData } = useContext(AuthContext)
  const { getUserById } = useContext(ChatContext)

  const isSentByMe = senderId === userData.id
  const sender = getUserById(senderId)

  return (
    <div
      className={cn(
        "py-2 px-4 rounded-lg shadow-md mt-4 last-of-type:mt-0",
        isSentByMe
          ? "self-end bg-teal-700 text-white"
          : "self-start bg-gray-200"
      )}
    >
      {!isSentByMe && (
        <p className="font-bold space-y-1 text-teal-600">
          {sender.firstName} {sender.lastName}
        </p>
      )}
      <p>{messageText}</p>
    </div>
  )
}
