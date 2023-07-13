import { TUserData } from '../controllers/auth/login'
import ChatRoom from './ChatRoom'
import { TChatMessage } from './messageEvents'
import { TUserStatus } from './userEvents'

export type TChatRoomsListEventType = 'pushAll' | 'add' | 'update' | 'remove'
export type TUsersListEventType = 'pushAll' | 'add' | 'update' | 'remove'

export type ServerToClientEvents = {
    usersListEvent: (type: TUsersListEventType, users: TUserStatus[]) => void
    serverMessage: (message: TChatMessage, chatRoomId: number) => void
    chatRoomsListEvent: (
        type: TChatRoomsListEventType,
        chatRooms: ChatRoom[]
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
