import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useContext, useState } from "react"
import { Button } from "../ui/button"
import { ChatContext } from "./ChatProvider"
import { Check, ChevronsUpDown } from "lucide-react"

type Props = {
  closeDialog: () => void
}

export default function CreateChatRoomDialog({ closeDialog }: Props) {
  const { getOtherUsers, createChatRoom } = useContext(ChatContext)
  const [open, setOpen] = useState(false)
  const [selectedUserIDs, setSelectedUserIDs] = useState<number[]>([])
  const [chatRoomName, setChatRoomName] = useState<string>("")

  function toggleUserId(userId: number) {
    if (selectedUserIDs.includes(userId)) {
      setSelectedUserIDs((userIds) => userIds.filter((id) => id !== userId))
    } else {
      setSelectedUserIDs((userIds) => [...userIds, userId])
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new chat room</DialogTitle>
        <DialogDescription>
          If you only add one person it's like a direct message
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="chatRoomName" className="text-right">
            Chatroom name
          </Label>
          <Input
            id="chatRoomName"
            placeholder="Awesome chat"
            className="col-span-3"
            onChange={(e) => setChatRoomName(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Add user(s)
          </Label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="justify-between col-span-3"
              >
                {selectedUserIDs.length === 1
                  ? getOtherUsers().find(
                      (user) => user.id === selectedUserIDs[0]
                    )?.firstName
                  : selectedUserIDs.length > 1
                  ? `${selectedUserIDs.length} users selected`
                  : "Select user..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="col-span-3 p-0">
              <Command>
                <CommandInput placeholder="Select user..." />
                <CommandEmpty>No user found</CommandEmpty>
                <CommandGroup>
                  {getOtherUsers().map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => {
                        toggleUserId(user.id)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedUserIDs.includes(user.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {user.firstName}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={() => {
            closeDialog()
            createChatRoom(chatRoomName, selectedUserIDs)
            setSelectedUserIDs([])
            setChatRoomName("")
          }}
        >
          Create chat
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
