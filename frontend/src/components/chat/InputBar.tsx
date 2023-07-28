import { SendIcon } from "lucide-react"
import { KeyboardEvent, Ref, forwardRef, useContext, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { ChatContext } from "./ChatProvider"

const InputBar = forwardRef((_, ref: Ref<HTMLInputElement>) => {
  const [message, setMessage] = useState<string>("")
  const { sendMessage } = useContext(ChatContext)

  function handleSendMessage() {
    sendMessage(message)
    setMessage("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex space-x-4 mr-4">
      <Input
        ref={ref}
        className="flex-1"
        placeholder="type text here..."
        onKeyDown={(e) => handleKeyDown(e)}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
      />
      <Button className="px-12" onClick={handleSendMessage}>
        Send <SendIcon className="h-4 w-4 ml-4 " />
      </Button>
    </div>
  )
})

export default InputBar
