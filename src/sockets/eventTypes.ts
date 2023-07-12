import { TUserData } from '../controllers/auth/login'
import { TChatRoom, TUserStatus } from './userEvents'

export type ServerToClientEvents = {
    usersListUpdate: (users: TUserStatus[]) => void
    serverMessage: (
        senderData: TUserData,
        message: string,
        sendAt: string
    ) => void
    chatRoomsListUpdate: (chatRooms: TChatRoom[]) => void
}

export type ClientToServerEvents = {
    newConnection: (token: string, userData: TUserData) => void
    clientMessage: (token: string, userData: TUserData, message: string) => void
    createChatRoom: (
        token: string,
        userData: TUserData,
        chatRoomName: string,
        userIds: number[]
    ) => void
}
