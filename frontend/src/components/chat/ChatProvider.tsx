import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { AuthContext } from "../auth/AuthProvider"

import { socket } from "@/socket"
import ChatRoomSrvModel from "@backend/sockets/ChatRoomSrvModel"
import {
  TChatRoomsListEventType,
  TUsersListEventType,
} from "@backend/sockets/eventTypes"
import { TMessage } from "@backend/entities/Message"
import { TUser } from "@backend/entities/User"
import { useToast } from "../ui/use-toast"

export type TChatUser = TUser & { isCurrentlyOpen?: boolean }

type TChatContext = {
  openChatRoom: (id: number) => void
  openedChatRoomId: number
  chatRooms: ChatRoomSrvModel[]
  messages: TMessage[]
  allUsers: Map<number, TChatUser>
  currentChatRoomUsers: TChatUser[]
  sendMessage: (message: string) => void
  createChatRoom: (chatRoomName: string, users: number[]) => void
  getOtherUsers: () => TChatUser[]
}

export const ChatContext = createContext<TChatContext>(null!)

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const { userData, token } = useContext(AuthContext)
  const { toast } = useToast()

  // current room messages
  const [messages, setMessages] = useState<TMessage[]>([])

  // all users
  const [allUsers, setAllUsers] = useState<Map<number, TChatUser>>(new Map())

  const [currentChatRoomUsers, setCurrentChatRoomUsers] = useState<TChatUser[]>(
    []
  )

  // all users chat rooms
  const [chatRooms, setChatRooms] = useState<ChatRoomSrvModel[]>([])

  // currently open chat room
  const [openedChatRoomId, setOpenedChatRoomId] = useState<number>(0)

  // Inital socket connection & handle disconnect
  useEffect(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  }, [])

  // Send inital credentials
  useEffect(() => {
    socket.emit("newConnection", token, userData)

    if (!userData.isEmailVerified) {
      toast({
        title: "Please verify your email",
        description:
          "Go to your email service and confirm your email. This will allow you more access to the applicaiton.",
      })
    }
  }, [token, userData, toast])

  // Register event handlers
  useEffect(() => {
    function onUsersListUpdate(
      type: TUsersListEventType,
      newUsers: TChatUser[]
    ) {
      // console.log("Current users before", type, users)
      // console.log(type, newUsers)
      const updatedUsers = new Map(allUsers)
      switch (type) {
        case "pushAll":
        case "add":
        case "update": {
          newUsers.forEach((user) => {
            updatedUsers.set(user.id, user)
          })
          break
        }
        case "remove": {
          newUsers.forEach((user) => {
            updatedUsers.delete(user.id)
          })

          break
        }
        default:
          console.error("Unhandled usersListUpdate type:", type)
      }
      setAllUsers(updatedUsers)
    }

    function onServerMessage(newMessage: TMessage, targetChatRoomId: number) {
      console.log(newMessage)
      console.log(
        `User ${newMessage.senderData.firstName} send mes: ${newMessage.message} to room id: ${targetChatRoomId}`
      )

      setChatRooms((chatRooms) => {
        const newChatRooms = [...chatRooms]
        const targetRoomIndex = newChatRooms.findIndex(
          (chatRoom) => chatRoom.id === targetChatRoomId
        )

        if (targetRoomIndex === -1) {
          console.error(
            "The room that the message from server is searcing for is not found",
            { newMessage, targetChatRoomId }
          )
          return newChatRooms
        }

        newChatRooms[targetRoomIndex].messages.unshift(newMessage)

        return newChatRooms
      })
    }

    function onChatRoomsListEvent(
      type: TChatRoomsListEventType,
      newChatRooms: ChatRoomSrvModel[]
    ) {
      const newChatRoomIds = newChatRooms.map((chatRoom) => chatRoom.id)

      console.log(`${type}`, newChatRooms)

      switch (type) {
        case "pushAll": {
          setChatRooms(newChatRooms)
          break
        }
        case "add": {
          setChatRooms((currentChatRooms) => [
            ...currentChatRooms,
            ...newChatRooms,
          ])
          break
        }
        case "update": {
          // delete and add rooms
          setChatRooms((currnetChatRooms) => [
            ...currnetChatRooms.filter(
              ({ id }) => !newChatRoomIds.includes(id)
            ),
            ...newChatRooms,
          ])
          break
        }
        case "remove": {
          setChatRooms((currentChatRooms) =>
            currentChatRooms.filter(({ id }) => !newChatRoomIds.includes(id))
          )
          break
        }
        default:
          console.error("Unhandled chatRoomsListEvent type:", type)
      }
    }

    socket.on("usersListEvent", onUsersListUpdate)
    socket.on("serverMessage", onServerMessage)
    socket.on("chatRoomsListEvent", onChatRoomsListEvent)

    return () => {
      socket.off("usersListEvent", onUsersListUpdate)
      socket.off("serverMessage", onServerMessage)
      socket.off("chatRoomsListEvent", onChatRoomsListEvent)
    }
  }, [allUsers])

  useEffect(() => {
    const targetChatRooms = chatRooms.filter(
      (chatRoom) => chatRoom.id === openedChatRoomId
    )
    if (targetChatRooms.length < 1) {
      setMessages([])
      console.error(
        `room with id: ${openedChatRoomId} not found in chat rooms:`,
        chatRooms
      )
    } else if (targetChatRooms.length === 1) {
      setMessages(targetChatRooms[0].messages)

      const chatRoomUsers = []

      for (const id of targetChatRooms[0].userIds) {
        const user = allUsers.get(id)
        if (!user) {
          console.log(`id: ${id} not found in allUsers`)
        } else {
          chatRoomUsers.push(user)
        }
      }

      setCurrentChatRoomUsers(chatRoomUsers)

      console.log("target room foumd. setting messages and users")
    } else {
      setMessages([])
      console.error("found multiple rooms with same id", targetChatRooms)
    }
  }, [openedChatRoomId, chatRooms, allUsers])

  function sendMessage(message: string) {
    if (message.length === 0) return

    console.log("sending message", message, openedChatRoomId, chatRooms)

    socket.emit("clientMessage", token, userData, message, openedChatRoomId)
  }

  function createChatRoom(chatRoomName: string, userIds: number[]) {
    if (chatRoomName.length === 0 || userIds.length === 0) return
    socket.emit(
      "createChatRoom",
      token,
      userData,
      chatRoomName,
      userIds,
      (newChatRoomId) => {
        console.log("selecting new room", newChatRoomId)
        setOpenedChatRoomId(newChatRoomId)
      }
    )
  }

  function openChatRoom(id: number) {
    const chatRoom = chatRooms.filter((chatRoom) => chatRoom.id === id)[0]
    setMessages(chatRoom.messages)
    setOpenedChatRoomId(id)
  }

  /**
   * Returns all users that are not the current user
   */
  function getOtherUsers() {
    return Array.from(allUsers.values()).filter(
      (user) => user.id !== userData.id
    )
  }

  const value: TChatContext = {
    openChatRoom,
    openedChatRoomId,
    messages,
    allUsers,
    currentChatRoomUsers,
    chatRooms,
    sendMessage,
    createChatRoom,
    getOtherUsers,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
