import { Request, Response } from 'express'
import {
    DatabaseError,
    TokenInvalid,
    TokenNotProvided,
    TokenWrongType,
} from '../../constants/errorTypes'
import { User } from '../../entities/User'
import { TChangePasswordData } from '../../middleware/validation/auth'
import { parseJwt } from '../../utils/parseJwt'

// TODO: make this the base type and then each endpoint can define differnet types for it's needs
export type TChangePasswrodResponse = {
    message: string
    type: TokenWrongType | TokenNotProvided | TokenInvalid | DatabaseError
}

// FIXME: the token used to reset the password should be invalidated after usage
// making it a one time token
export const changePassword = async (req: Request, res: Response) => {
    const { password, token: tokenEncoded } = req.body as TChangePasswordData

    const token = tokenEncoded.replaceAll('___', '.')

    const parsedTokenData = parseJwt(token)

    if (!parsedTokenData.isTokenValid) {
        const response: TChangePasswrodResponse = {
            message: 'Invalid token',
            type: 'token/invalid',
        }
        return res.status(400).json(response)
    }

    const { email, id, tokenType } = parsedTokenData.jwtPayload

    if (tokenType !== 'password-reset') {
        const response: TChangePasswrodResponse = {
            type: 'token/wrong-type',
            message: 'Wrong JWT type',
        }
        return res.status(400).json(response)
    }

    try {
        const user = await User.findOneByOrFail({ id })
        user.password = password
        user.hashPassword()
        await user.save()

        console.log(`password for user ${email} has been changed`)
        return res.status(200).json({ message: 'Password sucessfuly changed' })
    } catch (error) {
        console.error(`Failed to update password for user ${email} in database`)

        const response: TChangePasswrodResponse = {
            message: 'Failed to update password in database',
            type: 'database/error',
        }

        return res.status(400).json(response)
    }
}
