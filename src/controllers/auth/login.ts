import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'
import { type TLoginUserData } from '../../middleware/validation/auth/validatorLogin'
import { TJWTPayload } from '../../@types/JwtPayload'
import { createJwtToken } from '../../constants/utils/createJwtToken'

export const login = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    const { email, password } = req.body as TLoginUserData

    const user = await userRepository.findOne({ where: { email } })

    // FIXME: This error messages can be merget to be the same
    // this can prevent guessing of email adresses and passwords
    if (!user) {
        return res
            .status(400)
            .json({ message: `User with email: ${email} not found.` })
    }

    if (!user.checkIfPasswordMatch(password)) {
        return res.status(400).json({ message: 'Inccorect email or password' })
    }

    const JwtPayload: TJWTPayload = {
        id: user.id,
        email: user.email,
    }

    try {
        const token = createJwtToken(JwtPayload)

        // TODO: this can be removed if the info is not needed on login
        const outputUserData: Partial<User> = { ...user }

        delete outputUserData.password

        return res.status(200).json({
            message: 'User succesfully logged in',
            token,
        })
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Token can't be created", error })
    }
}
