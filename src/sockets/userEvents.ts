import { Socket, Server } from 'socket.io'
import { NEW_CONNECTION, TNewConnectionPayload } from './eventTypes/fromClient'
import { TUserData } from '../controllers/auth/login'
import {
    TUsersListUpdatePayload,
    USERS_LIST_UPDATE,
} from './eventTypes/fromServer'

export type TUserStatus = TUserData & { isOnline: boolean; sockedID: string }

export const USERS: TUserStatus[] = []

const handleUserEvents = (io: Server, socket: Socket) => {
    socket.on(NEW_CONNECTION, (data: TNewConnectionPayload) => {
        // TODO: verify token

        const userIndex = USERS.findIndex(({ id }) => data.userData.id === id)

        if (userIndex !== -1) {
            // user is already in the list
            USERS[userIndex].isOnline = true
            USERS[userIndex].sockedID = socket.id

            const payload: TUsersListUpdatePayload = {
                users: USERS,
            }

            console.log(
                `User: ${USERS[userIndex].firstName} is now online!, sending update to everyone`
            )
            io.emit(USERS_LIST_UPDATE, payload)
            return
        }

        // a new user need to be added to the list
        const newUser: TUserStatus = {
            ...data.userData,
            isOnline: true,
            sockedID: socket.id,
        }

        USERS.push(newUser)

        const payload: TUsersListUpdatePayload = {
            users: USERS,
        }

        console.log(
            `Adding new user ${data.userData.firstName} and sending update to every one`
        )

        io.emit(USERS_LIST_UPDATE, payload)
    })
}

export default handleUserEvents
