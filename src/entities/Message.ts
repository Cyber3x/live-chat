import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'varchar', length: 50 })
    sentAtFromUser!: string

    @Column({ type: 'varchar', length: 50 })
    sentAtFromServer!: string

    @Column()
    message!: string

    // @ManyToOne(() => User, (user) => user.sentMessages)
    // sentBy!: User

    // @ManyToOne(() => User, (user) => user.recievedMessages)
    // sentTo!: User

    @Column('boolean')
    isRead!: boolean
}
