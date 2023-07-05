import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TRegisterUserData } from '../../middleware/validation/auth/validatorRegister'

export const register = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const newUserData = req.body as TRegisterUserData

    const user = await userRepository.findOne({
        where: { email: newUserData.email },
    })

    if (user) {
        return res.status(400).json({ error: 'User already exists' })
    }

    const newUser = userRepository.create({ ...newUserData, isOnline: true })
    await userRepository.save(newUser)

    const outputUserData: Partial<User> = { ...newUser }

    delete outputUserData.password

    return res
        .status(201)
        .json({ message: 'User successfully created', data: outputUserData })
}
