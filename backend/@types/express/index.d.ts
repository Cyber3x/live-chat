import { TJWTPayload } from '../JwtPayload'

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface Request {
            jwtPayload: TJWTPayload
        }
    }
}
