import { Resend } from 'resend'
import { TJWTPayload } from '../types/JwtPayload'
import { createJwtToken } from './createJwtToken'

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (
    from: string,
    to: string,
    subject: string,
    html: string
) => {
    try {
        await resend.emails.send({
            from,
            to,
            subject,
            html,
        })

        console.log(`Mail send to ${to}`)
    } catch (error) {
        console.log(`Unable to send mail to ${to}`)
    }
}

export default sendEmail

export const sendVerificationEmail = async (
    firstName: string,
    userId: number,
    email: string
) => {
    const jwtPayload: TJWTPayload = {
        id: userId,
        email,
        type: 'verify-email',
    }

    try {
        const token = createJwtToken(jwtPayload, '15min')

        await sendEmail(
            'LiveChat <livechat@resend.dev>',
            email,
            'Email confirmation',
            getMailVerificationHTMLTemplate(firstName, token)
        )
        return { ok: true }
    } catch (error) {
        return { ok: false }
    }
}

function getMailVerificationHTMLTemplate(firstName: string, token: string) {
    return `<div
    style="
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        padding: 0;
        margin: 0 auto;
        width: 60%;
    "
>
    <div
        style="
            background-color: white;
            border-radius: 0.5rem;
            padding: 1rem 3rem;
            margin: 4rem 0;
            background-color: rgb(0, 66, 75);
        "
    >
        <h1 style="color: white">Verify your email</h1>
        <p style="color: #aaaaaa">
            In order to make your account more secure we want you to verify your
            email
        </p>
        <button
            style="
                background-color: rgb(0, 153, 153);
                color: white;
                font-weight: bold;
                font-size: medium;
                border: none;
                border-radius: 0.25rem;
                letter-spacing: 1px;
                font-family: inherit;
                width: 100%;
                margin: 2rem 0;
                padding: 0;
            "
        >
            <a
                href="http://localhost:${process.env.PORT}/auth/verify-email/${token}"
                style="
                    padding: 1rem 4rem;
                    display: block;
                    text-decoration: none;
                    color: white;
                    font-family: inherit;
                "
                >Verify email</a
            >
        </button>
        <p style="text-align: center; color: #aaa">LiveChat Team</p>
    </div>
</div>

`
}
