import { AuthContext } from "@/components/auth/AuthProvider"
import ChatMessages from "@/components/chat/ChatMessages"
import InputBar from "@/components/chat/InputBar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { socket } from "@/socket"
import { useContext, useEffect, useState } from "react"
import {
  CLIENT_MESSAGE,
  NEW_CONNECTION,
  TClientMessagePayload,
  TNewConnectionPayload,
} from "../../../src/sockets/eventTypes/fromClient"

import ChatUsers from "@/components/chat/ChatUsers"
import { TUserData } from "../../../src/controllers/auth/login"
import {
  SERVER_MESSAGE,
  TServerMessagePayload,
  TUsersListUpdatePayload,
  USERS_LIST_UPDATE,
} from "../../../src/sockets/eventTypes/fromServer"
import { TUserStatus } from "../../../src/sockets/userEvents"

// MOCK DATA
export type TUser = TUserStatus & { isCurrentlyOpen?: boolean }

export type TChatMessage = {
  isSentByMe: boolean
  message: string
  sentAt: string
  senderData: TUserData
}

export default function ChatHome() {
  const { token, logout, userData } = useContext(AuthContext)

  const [messages, setMessages] = useState<TChatMessage[]>([])
  const [users, setUsers] = useState<TUser[]>([])

  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const payload: TNewConnectionPayload = {
      token,
      userData,
    }
    socket.emit(NEW_CONNECTION, payload)
  }, [token, userData])

  useEffect(() => {
    function onUsersListUpdate(data: TUsersListUpdatePayload) {
      setUsers(data.users)
    }

    function onServerMessage(data: TServerMessagePayload) {
      const { message, senderData, sentAt } = data

      const newMessage: TChatMessage = {
        message,
        senderData,
        sentAt,
        isSentByMe: false,
      }

      setMessages((messages) => [...messages, newMessage])
    }

    socket.on(USERS_LIST_UPDATE, onUsersListUpdate)
    socket.on(SERVER_MESSAGE, onServerMessage)

    return () => {
      socket.off(USERS_LIST_UPDATE, onUsersListUpdate)
      socket.off(SERVER_MESSAGE, onServerMessage)
    }
  }, [users, messages])

  function sendMessage(message: string) {
    if (message.length === 0) return
    const newMessage: TChatMessage = {
      message,
      isSentByMe: true,
      senderData: userData,
      sentAt: new Date().toDateString(),
    }

    const payload: TClientMessagePayload = {
      message,
      token,
      userData,
    }

    socket.emit(CLIENT_MESSAGE, payload)

    setMessages((messages) => [...messages, newMessage])
  }

  return (
    <div className="h-full flex flex-col p-4 pr-0">
      <div className="w-full h-max flex justify-between items-center pr-4">
        <h1 className="font-bold tracking-tight text-3xl">LiveChat</h1>
        <div className="flex space-x-4 items-center">
          <h1 className="font-bold text-teal-700 text-md">
            {userData.firstName} {userData.lastName}
          </h1>
          <Button size={"sm"} variant={"outline"} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <Separator className="my-4 block" />
      <div className="flex flex-1 min-h-0">
        <ChatUsers users={users} />
        <Separator orientation="vertical" className="mx-4 mb-4" />
        <div className="flex-1 flex-col flex space-y-4 place-self-end">
          <ChatMessages messages={messages} />
          <InputBar onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  )
}
