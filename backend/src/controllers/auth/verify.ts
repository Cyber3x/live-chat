import { Request, Response } from 'express'
import { User } from '../../entities/User'
import { parseJwt } from '../../utils/parseJwt'
import {
    TokenInvalid,
    TokenNotProvided,
    TokenWrongType,
} from '../../constants/errorTypes'

type TResponse = {
    message: string
    type: TokenWrongType | TokenNotProvided | TokenInvalid
}

export const verify = async (req: Request, res: Response) => {
    const { token } = req.params

    if (!token) {
        const response: TResponse = {
            message: 'Verification token not provided',
            type: 'token/not-provided',
        }
        return res.status(400).json(response)
    }

    const parsedTokenData = parseJwt(token)

    if (!parsedTokenData.isTokenValid) {
        const response: TResponse = {
            message: 'Failed to validate email verification token',
            type: 'token/invalid',
        }
        return res.status(400).json(response)
    }

    const { tokenType, email, id } = parsedTokenData.jwtPayload

    if (tokenType !== 'verify-email') {
        const response: TResponse = {
            type: 'token/wrong-type',
            message: 'Wrong JWT type',
        }
        return res.status(400).json(response)
    }

    try {
        User.createQueryBuilder()
            .update()
            .set({ isEmailVerified: true })
            .where('id = :id', { id: id })
            .execute()

        console.log(`isEmailVerified for user ${email} updated`)
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Failed to update isEmailVerified in database' })
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/email-verified`)
}
