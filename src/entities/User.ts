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
    private password!: string

    @Column({ type: 'boolean' })
    isOnline!: boolean

    @Column({ type: 'boolean' })
    isLoggedIn!: boolean

    @Column()
    @CreateDateColumn()
    createdAt!: Date

    @Column()
    @UpdateDateColumn()
    updatedAt!: Date

    @BeforeInsert()
    private hashPassword() {
        this.password = hashSync(this.password, SALT_ROUNDS)
    }

    checkIfPasswordMatch(unencryptedPassword: string) {
        return compareSync(unencryptedPassword, this.password)
    }
}
