import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { TJWTPayload } from '../../types/JwtPayload'
import { User } from '../../entities/User'

export const verify = async (req: Request, res: Response) => {
    const { token } = req.params

    if (!token) {
        return res
            .status(400)
            .json({ message: 'Verification token not provided' })
    }

    type TJwtPayloadRaw = { [key: string]: string }
    let jwtPayloadRaw: TJwtPayloadRaw
    let jwtPayload: TJWTPayload

    try {
        jwtPayloadRaw = jwt.verify(
            token,
            process.env.JWT_TOKEN_SECRET as string
        ) as TJwtPayloadRaw
        ;['iat', 'exp'].forEach((key) => delete jwtPayloadRaw[key])
        jwtPayload = jwtPayloadRaw as unknown as TJWTPayload

        if (jwtPayload.type !== 'verify-email') {
            return res.status(400).json({ message: 'JWT wrong token type' })
        }

        console.log(`email for user: ${jwtPayload.email} confirmed`)
    } catch (error) {
        return res
            .status(400)
            .json({ message: 'Failed to validate email verification token' })
    }

    try {
        User.createQueryBuilder()
            .update()
            .set({ isEmailVerified: true })
            .where('id = :id', { id: jwtPayload.id })
            .execute()
        console.log(`isEmailVerified for user ${jwtPayload.email} updated`)
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Failed to update isEmailVerified in database' })
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/email-verified`)
}
