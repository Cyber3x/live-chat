import { Request, Response } from 'express'

export const sendVerificationEmailController = (
    req: Request,
    res: Response
) => {
    const { id } = req.jwtPayload

    // TODO: implement an endpoint wehre the suer can request a email verification mail,
    // IMPORTANT: first check if that use is not already verified
    // also somehow limit this endpoint to evenr 15mins (that's the lasting of token)
    // we wan't to reduce mail usage (:()

    res.status(200).json({ id })
}
