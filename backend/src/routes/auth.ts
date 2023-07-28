import { Router } from 'express'
import { checkJwt } from '../middleware'
import {
    changePassword,
    login,
    register,
    sendForgotPassowrdEmail,
    sendVerificationEmailController,
    verify,
} from '../controllers/auth'
import {
    FormSchemaLoginData,
    FormSchemaMailInput,
    FormSchemaPasswordChange,
    FormSchemaRegisterData,
    validatorCreator,
} from '../middleware/validation/auth'

const router = Router({ mergeParams: true })

router.post('/register', [validatorCreator(FormSchemaRegisterData)], register)
router.post('/login', [validatorCreator(FormSchemaLoginData)], login)

// After user clicks the link in the email he'll be lead to here
// Fetch the toke, verify it and update state in the database
router.get('/verify-email/:token', verify)

// The endpoint that sends the user new email verification mail
// Used if the users current token expired and he want's to verify himself
router.get('/email-verification', [checkJwt], sendVerificationEmailController)

// Used when the user need to input their mail so we can send them passowrd reset mail
router.post(
    '/forgot-password',
    [validatorCreator(FormSchemaMailInput)],
    sendForgotPassowrdEmail
)

router.post(
    '/change-password',
    [validatorCreator(FormSchemaPasswordChange)],
    changePassword
)

// router.get('/logout', logout)
// TODO: loggin out currently is just removing the jwt from client
// there is no state stored about the token on the server.
// this can be done by checking if the user is currently logged in and has a valid token

export default router
