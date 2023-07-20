import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TRegisterUserData } from '../../middleware/validation/auth/validatorRegister'
import { createJwtToken } from '../../utils/createJwtToken'
import {
    UserAlreadyExists,
    EmailNotFound,
    InvalidEmailOrPassword,
    TokenCreationError,
} from '../../constants/errorTypes'
import { TUserData } from './login'
import { TJWTPayload } from '../../types/JwtPayload'

export type TRegisterResponseOK = {
    token: string
    userData: TUserData
}

export type TRegisterErrorType =
    | EmailNotFound
    | InvalidEmailOrPassword
    | TokenCreationError
    | UserAlreadyExists

export type TRegisterResponseError = {
    type: TRegisterErrorType
    message: string
}

export const register = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const newUserData = req.body as TRegisterUserData

    const user = await userRepository.findOne({
        where: { email: newUserData.email },
    })

    if (user) {
        const response: TRegisterResponseError = {
            message: 'User already exists',
            type: 'auth/user-already-exists',
        }

        return res.status(400).json(response)
    }

    const newUser = userRepository.create({
        ...newUserData,
        isOnline: true,
        isLoggedIn: true,
    })
    await userRepository.save(newUser)

    const JwtPayload: TJWTPayload = {
        id: newUser.id,
        email: newUser.email,
    }

    try {
        const token = createJwtToken(JwtPayload)

        const { id, firstName, lastName } = newUser

        const response: TRegisterResponseOK = {
            token,
            userData: {
                id,
                firstName,
                lastName,
            },
        }

        res.status(201).json(response)
    } catch (error) {
        const response: TRegisterResponseError = {
            message: "Token while registration can't be created",
            type: 'token/error-while-creating',
        }

        res.json(400).json(response)
    }
}
