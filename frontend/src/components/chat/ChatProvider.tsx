import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { AuthContext } from "../auth/AuthProvider"

import { useMap, useEffectOnce } from "usehooks-ts"
import { socket } from "@/socket"
import {
  TChatRoom,
  TChatRoomMinimal,
  TChatRoomsListEventType,
  TMessage,
  TUserMinimal,
  TUsersListEventType,
} from "@backend/sockets/eventTypes"
import { useToast } from "../ui/use-toast"

type TChatContext = {
  chatRooms: TChatRoomMinimal[]
  currentChatRoom: TChatRoom | null
  openChatRoom: (id: number) => void
  users: TUserMinimal[]
  getUserById: (id: number) => TUserMinimal
  createChatRoom: (chatRoomName: string, userIds: number[]) => void
  getOtherUsers: () => TUserMinimal[]
  sendMessage: (message: string) => void
}

export const ChatContext = createContext<TChatContext>(null!)

export const ChatProvider = ({ children }: PropsWithChildren) => {
  const { userData, token } = useContext(AuthContext)
  const { toast } = useToast()

  const [currentChatRoom, setCurrentChatRoom] = useState<TChatRoom | null>(null)

  // all users chat rooms
  const [chatRooms, setChatRooms] = useState<TChatRoomMinimal[]>([])

  // all users
  const [usersMap, usersActions] = useMap<number, TUserMinimal>()

  // Inital socket connection & handle disconnect
  useEffectOnce(() => {
    socket.connect()

    return () => {
      socket.disconnect()
    }
  })

  // Send inital credentials
  useEffectOnce(() => {
    socket.emit("newConnection", token, userData)

    socket.emit("getUserChatRooms", token, userData, setChatRooms)

    socket.emit("getUsers", token, userData, (res) => {
      if (res.ok) {
        console.log("got all users", res.data)
        res.data.forEach((user) => {
          usersActions.set(user.id, user)
        })
      } else {
        console.error(res.message)
      }
    })

    if (!userData.isEmailVerified) {
      toast({
        title: "Please verify your email",
        description:
          "Go to your email service and confirm your email. This will allow you more access to the applicaiton.",
      })
    }
  })

  // Register event handlers
  useEffect(() => {
    function onUsersListUpdate(
      type: TUsersListEventType,
      newUsers: TUserMinimal[]
    ) {
      // console.log("Current users before", type, users)
      // console.log(type, newUsers)
      newUsers.forEach((user) => {
        if (type === "update") {
          usersActions.set(user.id, user)
        } else if (type === "remove") {
          usersActions.remove(user.id)
        } else {
          console.error("Unhandled usersListUpdate type:", type)
        }
      })
    }

    function onServerMessage(newMessage: TMessage, targetChatRoomId: number) {
      console.log(
        "new message from server",
        newMessage,
        "to room id:",
        targetChatRoomId
      )

      if (!currentChatRoom || targetChatRoomId !== currentChatRoom.id) {
        console.log("got message in an not open room")
        return
      }

      setCurrentChatRoom((chatRoom) => {
        if (!chatRoom) return null

        chatRoom.messages.unshift(newMessage)

        const newChatRoom = {
          ...chatRoom,
        }

        return newChatRoom
      })
    }

    function onChatRoomsListEvent(
      type: TChatRoomsListEventType,
      newChatRoom: TChatRoom
    ) {
      if (type === "add") {
        console.log("Adding new chat room", newChatRoom)
        setChatRooms((chatRooms) => [...chatRooms, newChatRoom])
      } else if (type === "remove") {
        throw new Error("NOT IMPLEMENTED")
        // TODO: implement this
      } else {
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
  }, [currentChatRoom, usersActions])

  function sendMessage(message: string) {
    if (message.length === 0 || currentChatRoom === null) return

    console.log(
      `sending message: ${message} to target room with id: ${currentChatRoom.id}`
    )

    socket.emit("clientMessage", token, userData, message, currentChatRoom.id)
  }

  function createChatRoom(chatRoomName: string, userIds: number[]) {
    if (chatRoomName.length === 0 || userIds.length === 0) return

    socket.emit(
      "createChatRoom",
      token,
      userData,
      chatRoomName,
      userIds,
      (newChatRoom) => {
        setCurrentChatRoom(newChatRoom)
      }
    )
  }

  function openChatRoom(id: number) {
    if (id < 0) {
      setCurrentChatRoom(null)
      return
    }

    socket.emit("getChatRoom", token, userData, id, (res) => {
      if (res.ok) {
        setCurrentChatRoom(res.data)
        console.log("current open chat room", res.data)
      } else {
        setCurrentChatRoom(null)
        console.error(res.message)
      }
    })
  }

  /**
   * Returns all users that are not the current user
   */
  function getOtherUsers(): TUserMinimal[] {
    return Array.from(usersMap.values()).filter(
      (user) => user.id !== userData.id
    )
  }

  function getUserById(id: number): TUserMinimal {
    const targetUser = usersMap.get(id)
    if (!targetUser) {
      throw new Error(`looking for user id: ${id}, wasn't able to find him`)
    }
    return targetUser
  }

  const value: TChatContext = {
    openChatRoom,
    chatRooms,
    currentChatRoom,
    users: Array.from(usersMap.values()),
    getUserById,
    sendMessage,

    createChatRoom,
    getOtherUsers,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}
