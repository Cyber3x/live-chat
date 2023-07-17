import { TUserData } from '../controllers/auth/login'
import { TMessage } from '../entities/Message'
import { TUser } from '../entities/User'
import ChatRoomSrvModel from './ChatRoomSrvModel'

export type TChatRoomsListEventType = 'pushAll' | 'add' | 'update' | 'remove'
export type TUsersListEventType = 'pushAll' | 'add' | 'update' | 'remove'

export type ServerToClientEvents = {
    usersListEvent: (type: TUsersListEventType, users: TUser[]) => void
    serverMessage: (message: TMessage, chatRoomId: number) => void
    chatRoomsListEvent: (
        type: TChatRoomsListEventType,
        chatRooms: ChatRoomSrvModel[]
    ) => void
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
        callback: (chatRoomId: number) => void
    ) => void
}

export type SocketData = {
    token: string
    userData: TUserData
}

export type InterServerEvent = object
