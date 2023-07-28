import { Router } from 'express'
import usersRouter from './users'
import authRouter from './auth'

const router = Router()

router.use('/users', usersRouter)
router.use('/auth', authRouter)

export default router
