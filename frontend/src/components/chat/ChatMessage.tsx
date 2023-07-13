import { cn } from "@/lib/utils"
import { TMessage } from "../../../../src/sockets/userEvents"
import { AuthContext } from "../auth/AuthProvider"
import { useContext } from "react"

type Props = {
  message: TMessage
}

export default function ChatMessage({ message }: Props) {
  const { message: messageText, senderData } = message
  const { userData } = useContext(AuthContext)

  const isSentByMe = senderData.id === userData.id

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
          {senderData.firstName} {senderData.lastName}
        </p>
      )}
      <p>{messageText}</p>
    </div>
  )
}
