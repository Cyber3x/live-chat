import { useContext } from "react"
import ChatMessage from "./ChatMessage"
import { ChatContext } from "./ChatProvider"

export default function ChatMessages() {
  const { messages } = useContext(ChatContext)

  return (
    <div className="flex-1 overflow-scroll">
      <div className="flex flex-1 h-full flex-col-reverse pb-4 pr-4 overflow-scroll">
        {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
      </div>
    </div>
  )
}
