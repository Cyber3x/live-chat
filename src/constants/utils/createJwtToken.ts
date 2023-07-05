import jwt = require('jsonwebtoken')
import { TJWTPayload as TJWTPayload } from '../../types/JwtPayload'

export const createJwtToken = (payload: TJWTPayload) => {
    if (!process.env.JWT_TOKEN_SECRET) {
        throw new Error("JWT_TOKEN_SECRET not found, can't be null")
    }

    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    })
}
