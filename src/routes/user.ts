import { Router } from 'express'
import { User } from '../entities/User'
import { AppDataSource } from '../data-source'

const userRouter = Router()

userRouter.get('/', async (_, res) => {
    // TEST INSERT
    const user1 = new User()
    user1.email = 'user1@gmail.com'
    user1.firstName = 'u1'
    user1.lastName = 'u1'
    user1.isOnline = true
    user1.password = 'password'
    await AppDataSource.manager.save(user1)

    const user2 = new User()
    user2.email = 'user2@gmail.com'
    user2.firstName = 'user2'
    user2.lastName = 'user2'
    user2.isOnline = true
    user2.password = 'password'
    await AppDataSource.manager.save(user2)

    res.json({ user1, user2 })
})

export default userRouter
