import { Column, Entity, ManyToOne, UpdateDateColumn } from 'typeorm'
import { User } from './User'
import { ChatRoom } from './ChatRoom'

@Entity()
export class ChatRoomUsers {
    @Column()
    lastReadAt!: Date

    @ManyToOne(() => User, (user) => user.chatRoomUsers)
    user!: User

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatRoomUsers)
    chatRoom!: ChatRoom

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date
}
