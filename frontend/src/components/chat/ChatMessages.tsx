import { useContext } from "react"
import ChatMessage from "./ChatMessage"
import { ChatContext } from "./ChatProvider"

type Props = {
  onClick?: () => void
}
export default function ChatMessages({ onClick }: Props) {
  const { currentChatRoom } = useContext(ChatContext)

  return (
    <div className="flex-1 overflow-scroll" onClick={onClick}>
      <div className="flex flex-1 h-full flex-col-reverse pb-4 pr-4 overflow-scroll">
        {currentChatRoom &&
          currentChatRoom.messages.map((message, i) => (
            <ChatMessage message={message} key={i} />
          ))}
      </div>
    </div>
  )
}
