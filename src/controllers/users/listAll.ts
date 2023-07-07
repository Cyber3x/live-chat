import { Request, Response } from 'express'
import { AppDataSource } from '../../data-source'
import { User } from '../../entities/User'

export const listAll = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User)

    console.log(req.jwtPayload.email)

    try {
        const users = await userRepository.find({
            select: [
                'id',
                'firstName',
                'lastName',
                'email',
                'isOnline',
                'createdAt',
                'updatedAt',
            ],
        })

        res.status(200).json({ users })
    } catch (error) {
        res.status(400).json({ message: "Can't retrive list of users.", error })
    }
}
