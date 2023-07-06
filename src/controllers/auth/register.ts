import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TRegisterUserData } from '../../middleware/validation/auth/validatorRegister'
import { TJWTPayload } from '../../@types/JwtPayload'
import { createJwtToken } from '../../constants/utils/createJwtToken'

export const register = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const newUserData = req.body as TRegisterUserData

    const user = await userRepository.findOne({
        where: { email: newUserData.email },
    })

    if (user) {
        return res.status(400).json({ error: 'User already exists' })
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

        const outputUserData: Partial<User> = { ...newUser }

        delete outputUserData.password

        res.status(201).json({
            message: 'User successfully created',
            token,
            data: outputUserData,
        })
    } catch (error) {
        res.json(400).json({
            message: "Token can't be created in register",
            error,
        })
    }
}
