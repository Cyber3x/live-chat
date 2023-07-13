import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { hashSync, compareSync } from 'bcrypt'
import { SALT_ROUNDS } from '../constants/auth'
import { ChatRoomUsers } from './ChatRoomUsers'
import { ChatRoom } from './ChatRoom'

@Entity()
export class User {
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

    @Column({ type: 'boolean' })
    isOnline!: boolean

    @Column({ type: 'boolean' })
    isLoggedIn!: boolean

    @Column()
    @CreateDateColumn()
    readonly createdAt!: Date

    @Column()
    @UpdateDateColumn()
    readonly updatedAt!: Date

    @BeforeInsert()
    private hashPassword() {
        this.password = hashSync(this.password, SALT_ROUNDS)
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return compareSync(unencryptedPassword, this.password)
    }
}
