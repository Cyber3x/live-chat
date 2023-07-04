import { Router } from 'express'

const userRouter = Router()

userRouter.get('/', (req, res) => {
    res.send('hello world')
})

export default userRouter
