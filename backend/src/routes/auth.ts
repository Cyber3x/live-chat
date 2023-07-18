import { Router } from 'express'
import { register } from '../controllers/auth/register'
import { validatorRegister } from '../middleware/validation/auth/validatorRegister'
import { validatorLogin } from '../middleware/validation/auth/validatorLogin'
import { login } from '../controllers/auth/login'

const router = Router()

router.post('/register', [validatorRegister], register)
router.post('/login', [validatorLogin], login)
// router.get('/logout', logout)
// TODO: loggin out currently is just removing the jwt from client
// there is no state stored about the token on the server.
// this can be done by checking if the user is currently logged in and has a valid token

export default router
