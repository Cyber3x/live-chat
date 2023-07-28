import { TJWTPayload } from '../types/JwtPayload'
import jwt from 'jsonwebtoken'

type TParseJwtResponse =
    | {
          isTokenValid: true
          jwtPayload: TJWTPayload
      }
    | {
          isTokenValid: false
          message: string
          error: unknown
      }

export const parseJwt = (token: string): TParseJwtResponse => {
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

        return { isTokenValid: true, jwtPayload }
    } catch (error) {
        return { isTokenValid: false, message: 'JWT validation failed', error }
    }
}
