import { TMessage, TUserStatus } from './userEvents'

export type TChatRoom = {
    name: string
    id: number
    users: TUserStatus[]
    messages: TMessage[]
    createdBy: TUserStatus
}

export default class ChatRoom {
    private static counter = 0

    readonly name: string
    readonly id: number
    private users: TUserStatus[]
    readonly messages: TMessage[]
    // NULL just in case that this is a global chat room
    private createdBy: TUserStatus | null

    constructor(
        name: string,
        createdBy: TUserStatus | null,
        users: TUserStatus[]
    ) {
        this.name = name
        this.createdBy = createdBy
        this.users = users
        this.messages = []
        this.id = ChatRoom.counter++
    }

    get allUsers(): TUserStatus[] {
        if (this.createdBy) {
            return [...this.users, this.createdBy]
        } else {
            return this.users
        }
    }

    addMessage(message: TMessage) {
        this.messages.unshift(message)
    }
}
