import jwt from 'jsonwebtoken'
import { TJWTPayload as TJWTPayload } from '../types/JwtPayload'

export const createJwtToken = (payload: TJWTPayload) => {
    return jwt.sign(payload, process.env.JWT_TOKEN_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION,
    })
}
