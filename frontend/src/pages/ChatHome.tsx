import { AuthContext } from "@/components/auth/AuthProvider"
import ChatMessages from "@/components/chat/ChatMessages"
import InputBar from "@/components/chat/InputBar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useContext } from "react"

import ChatSidebar from "@/components/chat/ChatSidebar"

export default function ChatHome() {
  const { logout, getUserFullName } = useContext(AuthContext)

  return (
    <div className="h-full flex flex-col p-4 pr-0">
      <div className="w-full h-max flex justify-between items-center pr-4">
        <h1 className="font-bold tracking-tight text-3xl">LiveChat</h1>
        <div className="flex space-x-4 items-center">
          <h1 className="font-bold text-teal-700 text-md">
            {getUserFullName()}
          </h1>
          <Button size={"sm"} variant={"outline"} onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
      <Separator className="my-4 block" />
      <div className="flex flex-1 min-h-0">
        <ChatSidebar />
        <Separator orientation="vertical" className="mx-4 mb-4" />
        <div className="flex-1 flex-col flex space-y-4">
          <ChatMessages />
          <InputBar />
        </div>
      </div>
    </div>
  )
}
