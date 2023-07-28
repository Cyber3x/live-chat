import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { ChatRoom } from './ChatRoom'
import { User } from './User'
import { TMessage } from '../sockets/eventTypes'

@Entity()
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    message!: string

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    chatRoom!: ChatRoom

    @ManyToOne(() => User, (user) => user.sentMessages, {
        onDelete: 'CASCADE',
    })
    sentBy!: User

    @Column()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date

    get publicVersion(): TMessage {
        return {
            id: this.id,
            message: this.message,
            senderId: this.sentBy.id,
            sentAt: this.createdAt,
        }
    }
}
