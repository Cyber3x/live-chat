import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const registerDataSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, { message: 'First name need to be at least 2 chars' }),
    lastName: z
        .string()
        .trim()
        .min(2, { message: 'Last name needs to be at least 2 chars' }),
    password: z
        .string()
        .min(8, { message: 'Password needs to be at least 8 characthers' }),
    email: z.string().email(),
})

export type TRegisterUserData = z.infer<typeof registerDataSchema>

export const validatorRegister = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const parsedRegisterData = registerDataSchema.safeParse(req.body)

    if (!parsedRegisterData.success) {
        // TODO: conver to CustomError
        return res.json(parsedRegisterData.error.issues).status(400)
    }

    return next()
}
