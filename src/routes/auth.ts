import { Router } from 'express'
import { register } from '../controllers/auth/register'
import { validatorRegister } from '../middleware/validation/auth/validatorRegister'
import { validatorLogin } from '../middleware/validation/auth/validatorLogin'
import { login } from '../controllers/auth/login'

const router = Router()

router.post('/register', [validatorRegister], register)
router.post('/login', [validatorLogin], login)
// router.get('/logout', logout)

export default router
