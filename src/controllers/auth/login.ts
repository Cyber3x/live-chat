import { Request, Response } from 'express'
import { CustomError } from '../../constants/utils/CustomError'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TLoginUserData } from '../../middleware/validation/auth/validatorLogin'

export const login = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const { email, password } = req.body as TLoginUserData

    const user = await userRepository.findOne({ where: { email } })

    // FIXME: This error messages can be merget to be the same
    // this can prevent guessing of email adresses and passwords
    if (!user) {
        return res
            .json(new CustomError(`User with email: ${email} not found.`))
            .status(400)
    }

    if (!user.checkIfPasswordMatch(password)) {
        return res
            .json(new CustomError('Inccorect email or password'))
            .status(400)
    }

    const outputUserData: Partial<User> = { ...user }

    delete outputUserData.password

    return res.json({ message: 'User logged in succesfully', outputUserData })
}
