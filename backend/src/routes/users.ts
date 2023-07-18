import { Router } from 'express'
import { checkJwt } from '../middleware/checkJwt'
import { listAll } from '../controllers/users/listAll'

const router = Router()

router.get('/', [checkJwt], listAll)

export default router
