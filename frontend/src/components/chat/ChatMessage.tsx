import { cn } from "@/lib/utils"
import { TChatMessage } from "@/pages/ChatHome"

type Props = {
  message: TChatMessage
}

export default function ChatMessage({ message }: Props) {
  return (
    <div
      className={cn(
        "py-2 px-4 rounded-lg shadow-md",
        message.isSentByMe
          ? "self-end bg-teal-700 text-white"
          : "self-start bg-gray-200"
      )}
    >
      {!message.isSentByMe && (
        <p className="font-bold space-y-1 text-teal-600">
          {message.senderName}
        </p>
      )}
      <p>{message.message}</p>
    </div>
  )
}
