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

    @Column('boolean')
    isRead!: boolean
}
