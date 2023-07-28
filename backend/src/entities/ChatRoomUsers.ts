import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { ChatRoom } from './ChatRoom'
import { User } from './User'

@Entity()
export class ChatRoomUsers extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column({ type: 'timestamp' })
    lastReadAt!: Date

    @ManyToOne(() => User, (user) => user.id, {
        onDelete: 'CASCADE',
    })
    user!: User

    @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.id, {
        onDelete: 'CASCADE',
    })
    chatRoom!: ChatRoom

    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date
}
