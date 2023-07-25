import 'dotenv/config'
import { NextFunction, Response, Request } from 'express'
import { createJwtToken } from '../utils/createJwtToken'
import { parseJwt } from '../utils/parseJwt'

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res
            .status(401)
            .json({ message: 'Authorization header not provided' })
    }

    const token = authHeader.split(' ')[1]

    const parsedData = parseJwt(token)

    if (!parsedData.isTokenValid) {
        return res
            .status(400)
            .json({ message: parsedData.message, error: parsedData.error })
    }

    const { jwtPayload } = parsedData

    if (jwtPayload.tokenType !== 'api-key') {
        return res.status(400).json({ message: 'JWT wrong token type' })
    }

    req.jwtPayload = jwtPayload

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
