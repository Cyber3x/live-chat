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
import { TUserMinimal } from '../sockets/eventTypes'

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
    password!: string

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
    hashPassword() {
        this.password = hashSync(
            this.password,
            parseInt(process.env.JWT_SALT_ROUNDS as string)
        )
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return compareSync(unencryptedPassword, this.password)
    }

    get publicVersion(): TUserMinimal {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            isOnline: this.isOnline,
        }
    }
}
