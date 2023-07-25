import { TMessage } from '../entities/Message'
import { TUser } from '../entities/User'
import { allUsers } from './serverState'

export type TChatRoom = {
    name: string
    id: number
    userIds: number[]
    messages: TMessage[]
    createdBy: TUser
}

export default class ChatRoomSrvModel {
    readonly id: number
    readonly name: string

    readonly userIds: number[]
    readonly messages: TMessage[]
    // NULL just in case that this is a global chat room
    readonly createdBy: number | null

    constructor(
        id: number,
        name: string,
        createdBy: number | null,
        userIds: number[],
        messages: TMessage[]
    ) {
        this.name = name
        this.createdBy = createdBy
        this.userIds = userIds
        this.messages = messages
        this.id = id
    }

    get numberOfUsers() {
        return this.userIds.length
    }

    get users() {
        const users: TUser[] = []
        this.userIds.forEach((userId) => {
            const user = allUsers.get(userId)

            if (!user)
                throw new Error(
                    `User with id: ${userId} in a room but not in the global user list, this should be impossible`
                )

            users.push(user)
        })
        return users
    }

    addMessage(message: TMessage) {
        this.messages.unshift(message)
    }

    addUser(userId: number) {
        this.userIds.push(userId)
        console.log(
            `Adding user with id: ${userId} to room: ${this.name}. Total count: ${this.userIds.length}`
        )
    }
}
