import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from './User'
import { ChatRoomUsers } from './ChatRoomUsers'
import { Message } from './Message'

@Entity()
export class ChatRoom extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column({ length: 50, type: 'varchar' })
    name!: string

    // createdby is NULL just in case that this is a global room created by the server
    @ManyToOne(() => User, (user) => user.id, {
        nullable: true,
        onDelete: 'CASCADE',
    })
    createdBy!: User

    @OneToMany(() => ChatRoomUsers, (chatRoomUsers) => chatRoomUsers.chatRoom)
    chatRoomUsers!: ChatRoomUsers[]

    @OneToMany(() => Message, (message) => message.chatRoom)
    messages!: Message[]
}
