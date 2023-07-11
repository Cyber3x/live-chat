import { cn } from "@/lib/utils"
import { TChatMessage } from "@/pages/ChatHome"

type Props = {
  message: TChatMessage
}

export default function ChatMessage({ message }: Props) {
  const { isSentByMe, message: messageText, senderData } = message

  return (
    <div
      className={cn(
        "py-2 px-4 rounded-lg shadow-md",
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
