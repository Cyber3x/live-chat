import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { hashSync } from 'bcrypt'

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

    // TODO: connect with messages after they are implemented
    // @OneToMany(() => Message, (message) => message.sentBy)
    // sentMessages!: Message[]

    // @OneToMany(() => Message, (message) => message.sentTo)
    // recievedMessages!: Message[]

    @BeforeInsert()
    hashPassword() {
        const saltRounds = 10
        this.password = hashSync(this.password, saltRounds)
    }
}
