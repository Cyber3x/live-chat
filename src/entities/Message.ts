import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { ChatRoom } from './ChatRoom'
import { TUser, User } from './User'

export type TMessage = {
    message: string
    senderData: TUser
    sentAt: Date
}
@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    message!: string

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
        cascade: ['remove'],
        nullable: true,
    })
    chatRoom!: ChatRoom

    @ManyToOne(() => User, (user) => user.sentMessages)
    sentBy!: User

    @Column()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date
}
