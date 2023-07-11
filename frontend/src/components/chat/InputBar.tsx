import { SendIcon } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { KeyboardEvent, useRef, useState } from "react"

type Props = {
  onSendMessage: (message: string) => void
}
export default function InputBar({ onSendMessage }: Props) {
  const [message, setMessage] = useState<string>("")

  const inputRef = useRef<HTMLInputElement>(null)

  function sendMessage() {
    onSendMessage(message)
    setMessage("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="flex space-x-4 mr-4">
      <Input
        ref={inputRef}
        className="flex-1"
        placeholder="type text here..."
        onKeyDown={(e) => handleKeyDown(e)}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        autoFocus
      />
      <Button className="px-12" onClick={sendMessage}>
        Send <SendIcon className="h-4 w-4 ml-4 " />
      </Button>
    </div>
  )
}
