import { Request, Response } from 'express'
import { TMailInputData } from '../../middleware/validation/auth/validators'
import { User } from '../../entities/User'
import { EmailNotFound, TokenCreationError } from '../../constants/errorTypes'
import { TJWTPayload } from '../../types/JwtPayload'
import { createJwtToken } from '../../utils/createJwtToken'
import sendEmail, {
    getMailResetPasswordHTMLTemplate,
} from '../../utils/sendEmail'

export type TForgotPasswordResponseError = {
    message: string
    type: EmailNotFound | TokenCreationError
}

export const sendForgotPassowrdEmail = async (req: Request, res: Response) => {
    const { email } = req.body as TMailInputData

    const user = await User.findOneBy({ email })

    if (!user) {
        const response: TForgotPasswordResponseError = {
            message: 'Email not found',
            type: 'auth/email-not-found',
        }

        return res.status(400).json(response)
    }

    const jwtPayload: TJWTPayload = {
        id: user.id,
        email,
        tokenType: 'password-reset',
    }

    try {
        const token = createJwtToken(jwtPayload, '15min')

        await sendEmail(
            'LiveChat <livechat@resend.dev>',
            email,
            'Reset password',
            getMailResetPasswordHTMLTemplate(
                user.firstName,
                token.replaceAll('.', '___')
            )
        )

        return res.status(200).send()
    } catch (error) {
        const response: TForgotPasswordResponseError = {
            message: "Token can't be created",
            type: 'token/error-while-creating',
        }

        return res.status(400).json(response)
    }
}
