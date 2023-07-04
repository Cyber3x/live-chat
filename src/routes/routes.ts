import { Router } from 'express'
import userRouter from './user'

const router = Router()

router.use('/user', userRouter)
// router.use('/users', usersRouter)
// router.use('/auth', auth)

export default router
