import ChatMessage from "@/components/chat/ChatMessage"
import InputBar from "@/components/chat/InputBar"
import UserStatus from "@/components/chat/UserStatus"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export type TUser = {
  firstName: string
  lastName: string
  email: string
  isOnline: boolean
}

const USERS: TUser[] = [
  {
    firstName: "John",
    lastName: "Johnson",
    email: "john.johnson@example.com",
    isOnline: true,
  },
  {
    firstName: "Sarah",
    lastName: "Taylor",
    email: "sarah.taylor@example.com",
    isOnline: true,
  },
  {
    firstName: "Emily",
    lastName: "Miller",
    email: "emily.miller@example.com",
    isOnline: true,
  },
  {
    firstName: "James",
    lastName: "Davis",
    email: "james.davis@example.com",
    isOnline: true,
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    isOnline: false,
  },
  {
    firstName: "Daniel",
    lastName: "Clark",
    email: "daniel.clark@example.com",
    isOnline: false,
  },
  {
    firstName: "Jessica",
    lastName: "Wilson",
    email: "jessica.wilson@example.com",
    isOnline: true,
  },
  {
    firstName: "Robert",
    lastName: "Walker",
    email: "robert.walker@gmail.com",
    isOnline: true,
  },
  {
    firstName: "Matthew",
    lastName: "Walker",
    email: "matthew.walker@example.com",
    isOnline: true,
  },
  {
    firstName: "Andrew",
    lastName: "Moore",
    email: "andrew.moore@example.com",
    isOnline: false,
  },
]

USERS.sort((a, z) => {
  if (a.isOnline && !z.isOnline) {
    return -1
  } else if (!a.isOnline && z.isOnline) {
    return 1
  } else {
    return 0
  }
})

export type TChatMessage = {
  isSentByMe: boolean
  message: string
  sentAt: string
  senderName: string
}

const CHAT_MESSAGES: TChatMessage[] = [
  {
    isSentByMe: true,
    message: "Hey, want to go out tonight?",
    sentAt: "2023-07-10T18:30:00",
    senderName: "John",
  },
  {
    isSentByMe: false,
    message: "Sure, where do you want to go?",
    sentAt: "2023-07-10T18:35:00",
    senderName: "Random User",
  },
  {
    isSentByMe: true,
    message: "How about that new restaurant downtown?",
    sentAt: "2023-07-10T18:40:00",
    senderName: "John",
  },
  {
    isSentByMe: false,
    message: "Sounds good! What time should we meet?",
    sentAt: "2023-07-10T18:45:00",
    senderName: "Random User",
  },
  {
    isSentByMe: true,
    message: "Let's meet at 7 PM. Does that work for you?",
    sentAt: "2023-07-10T18:50:00",
    senderName: "John",
  },
  {
    isSentByMe: false,
    message: "Perfect, see you at 7!",
    sentAt: "2023-07-10T18:55:00",
    senderName: "Random User",
  },
  {
    isSentByMe: true,
    message: "I'm looking forward to it!",
    sentAt: "2023-07-10T19:00:00",
    senderName: "John",
  },
  {
    isSentByMe: false,
    message: "Me too! It's been a while since we last hung out.",
    sentAt: "2023-07-10T19:05:00",
    senderName: "Random User",
  },
  {
    isSentByMe: true,
    message: "Yeah, it'll be great to catch up!",
    sentAt: "2023-07-10T19:10:00",
    senderName: "John",
  },
  {
    isSentByMe: false,
    message: "Definitely. See you tonight!",
    sentAt: "2023-07-10T19:15:00",
    senderName: "Random User",
  },
]

type Props = {
  messages: TChatMessage[]
}
function ChatBoxes({ messages }: Props) {
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

export default function ChatHome() {
  const [messages, setMessages] = useState<TChatMessage[]>(CHAT_MESSAGES)

  function addMessage(message: string) {
    const newMessage: TChatMessage = {
      message,
      isSentByMe: true,
      senderName: "John",
      sentAt: new Date().toDateString(),
    }
    setMessages((state) => [...state, newMessage])
  }

  return (
    <div className="h-full flex flex-col p-4 pr-0">
      <div className="w-full h-max">
        <h1 className="font-bold tracking-tight text-3xl">LiveChat</h1>
      </div>
      <Separator className="my-4 block" />
      <div className="flex flex-1 min-h-0">
        <div className="flex flex-col space-y-1 pb-2">
          {USERS.map((user, i) => (
            <UserStatus
              user={user}
              key={user.email}
              isCurrentlyOpen={i === 3}
            />
          ))}
        </div>
        <Separator orientation="vertical" className="mx-4 mb-4" />
        <div className="flex-1 flex-col flex space-y-4 place-self-end">
          <ChatBoxes messages={messages} />
          <InputBar onSendMessage={addMessage} />
        </div>
      </div>
    </div>
  )
}
