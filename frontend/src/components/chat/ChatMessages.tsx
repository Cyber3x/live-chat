import { TChatMessage } from "@/pages/ChatHome"
import { ScrollArea } from "../ui/scroll-area"
import ChatMessage from "./ChatMessage"

type Props = {
  messages: TChatMessage[]
}

export default function ChatMessages({ messages }: Props) {
  return (
    <ScrollArea className="h-full pr-4 min-h-0 flex-1 items-end flex">
      <div className="flex flex-col flex-1 pb-4 space-y-4 justify-end">
        {messages.map((message, i) => (
          <ChatMessage message={message} key={i} />
        ))}
      </div>
    </ScrollArea>
  )
}
