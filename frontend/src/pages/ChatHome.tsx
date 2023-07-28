import { AuthContext } from "@/components/auth/AuthProvider"
import ChatMessages from "@/components/chat/ChatMessages"
import InputBar from "@/components/chat/InputBar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useContext, useEffect, useRef } from "react"

import ChatSidebar from "@/components/chat/ChatSidebar"
import { ChatContext } from "@/components/chat/ChatProvider"

export default function ChatHome() {
  const { logout, getUserFullName } = useContext(AuthContext)
  const { openChatRoom, currentChatRoom } = useContext(ChatContext)
  const inputBarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        openChatRoom(-1)
      }
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [openChatRoom])

  function handleOnChatMessagesClick() {
    inputBarRef.current?.focus()
  }

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
          {currentChatRoom === null ? (
            <div className="flex justify-center items-center flex-1">
              <h1 className="text-gray-300 font-bold text-2xl">
                No chatrooms open. Open one and start chatting
              </h1>
            </div>
          ) : (
            <>
              <ChatMessages onClick={handleOnChatMessagesClick} />
              <InputBar ref={inputBarRef} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
