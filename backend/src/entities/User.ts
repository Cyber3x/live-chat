import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { hashSync, compareSync } from 'bcrypt'
import { ChatRoomUsers } from './ChatRoomUsers'
import { ChatRoom } from './ChatRoom'
import { Message } from './Message'

/**
 * This is the object that's send to the client and that's stored in servers memory for chat managment
 */
export type TUser = {
    id: number
    firstName: string
    lastName: string
    isOnline: boolean
    socketId?: string
    isLoggedIn: boolean
}
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    readonly id!: number

    @Column({ length: 100, type: 'varchar' })
    firstName!: string

    @Column({ length: 100, type: 'varchar' })
    lastName!: string

    @Column({ length: 100, type: 'varchar' })
    email!: string

    @Column('varchar')
    private password!: string

    @OneToMany(() => ChatRoomUsers, (chatRoomUsers) => chatRoomUsers.user)
    chatRoomUsers!: ChatRoomUsers[]

    @OneToMany(() => ChatRoom, (chatRoom) => chatRoom.createdBy)
    createdChatRooms!: ChatRoom[]

    @OneToMany(() => Message, (message) => message.sentBy)
    sentMessages!: Message[]

    @Column({ type: 'boolean' })
    isOnline!: boolean

    @Column({ type: 'boolean' })
    isLoggedIn!: boolean

    @Column({ type: 'boolean', default: false })
    readonly isEmailVerified!: boolean

    @Column()
    @CreateDateColumn({ type: 'timestamp' })
    readonly createdAt!: Date

    @Column()
    @UpdateDateColumn({ type: 'timestamp' })
    readonly updatedAt!: Date

    @BeforeInsert()
    private hashPassword() {
        this.password = hashSync(
            this.password,
            parseInt(process.env.JWT_SALT_ROUNDS as string)
        )
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return compareSync(unencryptedPassword, this.password)
    }

    get publicVersion(): TUser {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            isLoggedIn: this.isLoggedIn,
            isOnline: this.isOnline,
            socketId: '',
        }
    }
}
