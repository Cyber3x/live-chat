import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from './User'
import { ChatRoom } from './ChatRoom'

@Entity()
export class ChatRoomUsers {
    @Column()
    lastReadAt!: Date

    @ManyToOne(() => User, (user) => user.chatRooms)
    user!: User

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.users)
    chatRoom!: ChatRoom
}
