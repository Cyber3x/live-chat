// TODO: implement this, currently not used
import { Request, Response } from 'express'
import { CustomError } from '../utils/CustomError'

export const errorHandler = (err: CustomError, req: Request, res: Response) => {
    return res.status(err.statusCode).json({ hello: 'world' })
}
