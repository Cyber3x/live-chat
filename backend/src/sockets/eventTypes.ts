import { TUserData } from '../controllers/auth/login'
import { TCouldError } from '../types'

export type TChatRoomsListEventType = 'add' | 'remove'
export type TUsersListEventType = 'update' | 'remove'

export type TChatRoomMinimal = {
    name: string
    id: number
}

export type TChatRoom = {
    id: number
    name: string
    creatorId: number | null
    userIds: number[]
    messages: TMessage[]
}

export type TUserMinimal = {
    id: number
    firstName: string
    lastName: string
    isOnline: boolean
}

export type TMessage = {
    id: number
    message: string
    senderId: number
    sentAt: Date
}

export type ServerToClientEvents = {
    usersListEvent: (type: TUsersListEventType, users: TUserMinimal[]) => void
    chatRoomsListEvent: (
        type: TChatRoomsListEventType,
        chatRoom: TChatRoom
    ) => void

    serverMessage: (message: TMessage, targetChatRoomId: number) => void
}

export type ClientToServerEvents = {
    newConnection: (token: string, userData: TUserData) => void
    clientMessage: (
        token: string,
        senderData: TUserData,
        message: string,
        chatRoomId: number
    ) => void

    createChatRoom: (
        token: string,
        userData: TUserData,
        chatRoomName: string,
        userIds: number[],
        callback: (newChatRoom: TChatRoom) => void
    ) => void

    getUserChatRooms: (
        token: string,
        userData: TUserData,
        callback: (chatRooms: TChatRoomMinimal[]) => void
    ) => void

    getUsers: (
        token: string,
        userData: TUserData,
        callback: (data: TCouldError<TUserMinimal[]>) => void
    ) => void

    // chat room details
    getChatRoom: (
        token: string,
        userData: TUserData,
        targetChatRoomId: number,
        callback: (data: TCouldError<TChatRoom>) => void
    ) => void

    // TODO: implement @chatRoomEvents -> serverside event hanlder
    getChatRoomMessages: (
        token: string,
        userData: TUserData,
        targetChatRoomId: number,
        callback: (data: TCouldError<TMessage[]>) => void
    ) => void
}

export type SocketData = {
    token: string
    userData: TUserData
}

export type InterServerEvent = object
