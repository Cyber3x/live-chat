import { NextFunction, Request, Response } from 'express'
import { ZodObject, z } from 'zod'

export const validatorCreator = <T extends z.ZodRawShape>(
    formSchema: ZodObject<T>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsedData = formSchema.safeParse(req.body)

        if (!parsedData.success) {
            // TODO: conver to CustomError
            return res.json(parsedData.error.issues).status(400)
        }

        return next()
    }
}
