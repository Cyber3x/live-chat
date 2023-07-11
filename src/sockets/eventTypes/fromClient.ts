import { TUserData } from '../../controllers/auth/login'

export const NEW_CONNECTION = 'new_connect'
export type TNewConnectionPayload = {
    token: string
    userData: TUserData
}

export const CLIENT_MESSAGE = 'client_message'
export type TClientMessagePayload = {
    token: string
    userData: TUserData
    message: string
}
