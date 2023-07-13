import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { ChatRoomUsers } from './ChatRoomUsers'

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column({ length: 50, type: 'varchar' })
    name!: string

    @ManyToOne(() => User, (user) => user.id)
    createdBy!: User

    @OneToMany(() => ChatRoomUsers, (chatRoomUsers) => chatRoomUsers.chatRoom)
    users!: ChatRoomUsers[]
}
