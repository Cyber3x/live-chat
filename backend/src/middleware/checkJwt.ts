import 'dotenv/config'
import { NextFunction, Response, Request } from 'express'
import jwt = require('jsonwebtoken')
import { TJWTPayload } from '../types/JwtPayload'
import { createJwtToken } from '../utils/createJwtToken'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res
            .status(401)
            .json({ message: 'Authorization header not provided' })
    }

    const token = authHeader.split(' ')[1] as string

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

        if (jwtPayload.type !== 'api-key') {
            return res.status(400).json({ message: 'JWT wrong token type' })
        }

        req.jwtPayload = jwtPayload
    } catch (error) {
        return res.status(400).json({ message: 'JWT validation failed', error })
    }

    try {
        // Refresh and send a new token on every request
        const newToken = createJwtToken(
            jwtPayload,
            process.env.JWT_EXPIRATION as string
        )
        res.setHeader('token', `Bearer ${newToken}`)
        return next()
    } catch (error) {
        return res
            .status(400)
            .json({ message: "Token can't be created", error })
    }
}
