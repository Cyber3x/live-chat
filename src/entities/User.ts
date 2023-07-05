import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { hashSync, compareSync } from 'bcrypt'
import { SALT_ROUNDS } from '../constants/auth'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ length: 100, type: 'varchar' })
    firstName!: string

    @Column({ length: 100, type: 'varchar' })
    lastName!: string

    @Column({ length: 100, type: 'varchar' })
    email!: string

    @Column('varchar')
    password!: string

    @Column('boolean')
    isOnline!: boolean

    @Column()
    @CreateDateColumn()
    createdAt!: Date

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date

    // TODO: connect with messages after they are implemented
    // @OneToMany(() => Message, (message) => message.sentBy)
    // sentMessages!: Message[]

    // @OneToMany(() => Message, (message) => message.sentTo)
    // recievedMessages!: Message[]

    @BeforeInsert()
    private hashPassword() {
        this.password = hashSync(this.password, SALT_ROUNDS)
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return compareSync(unencryptedPassword, this.password)
    }
}
