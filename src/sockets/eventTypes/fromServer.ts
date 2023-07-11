import { TUserData } from '../../controllers/auth/login'
import { TUserStatus } from '../userEvents'

export const USERS_LIST_UPDATE = 'users_list_update'
export type TUsersListUpdatePayload = {
    users: TUserStatus[]
}

export const SERVER_MESSAGE = 'server_message'
export type TServerMessagePayload = {
    senderData: TUserData
    message: string
    sentAt: string
}
