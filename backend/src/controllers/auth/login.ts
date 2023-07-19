import { Request, Response } from 'express'
import { TJWTPayload } from '../../@types/JwtPayload'
import {
    EmailNotFound,
    InvalidEmailOrPassword,
    TokenCreationError,
} from '../../constants/errorTypes'
import { createJwtToken } from '../../utils/createJwtToken'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TLoginUserData } from '../../middleware/validation/auth/validatorLogin'

export type TUserData = {
    id: number
    firstName: string
    lastName: string
}

export type TLoginResponseOK = {
    token: string
    userData: TUserData
}

export type TLoginErrorType =
    | EmailNotFound
    | InvalidEmailOrPassword
    | TokenCreationError

export type TLoginResponseError = {
    type: TLoginErrorType
    message: string
}

export const login = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const { email, password } = req.body as TLoginUserData

    const user = await userRepository.findOne({ where: { email } })

    // FIXME: This error messages can be merget to be the same
    // this can prevent guessing of email adresses and passwords
    if (!user) {
        // TODO: convert type to Enum and refacotr this to be an objec that is passed to error handler
        const response: TLoginResponseError = {
            message: 'Email not found.',
            type: 'auth/email-not-found',
        }
        return res.status(400).json(response)
    }

    if (!user.checkIfPasswordMatch(password)) {
        const response: TLoginResponseError = {
            message: 'Inccorect email or password',
            type: 'auth/invalid-email-or-password',
        }

        return res.status(400).json(response)
    }

    const JwtPayload: TJWTPayload = {
        id: user.id,
        email: user.email,
    }

    try {
        const token = createJwtToken(JwtPayload)

        const { firstName, lastName, id } = user

        const response: TLoginResponseOK = {
            token,
            userData: {
                id,
                firstName,
                lastName,
            },
        }

        return res.status(200).json(response)
    } catch (error) {
        const response: TLoginResponseError = {
            message: "Token can't be created",
            type: 'token/error-while-creating',
        }

        return res.status(400).json(response)
    }
}
