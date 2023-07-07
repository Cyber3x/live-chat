import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const loginDataSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export type TLoginUserData = z.infer<typeof loginDataSchema>

export const validatorLogin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsedLoginData = loginDataSchema.safeParse(req.body)

    if (!parsedLoginData.success) {
        // TODO: conver to CustomError
        return res.json(parsedLoginData.error.issues).status(400)
    }

    return next()
}
