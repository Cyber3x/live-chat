import { User } from '../../entities/User'
import { logger } from '../../utils/logger'
import { TSocket, TSocketServer, userToSockerMapping } from '../socket'

const handleUserEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('newConnection', async (token, userData) => {
        // TODO: verify token

        let user = await User.findOneByOrFail({ id: userData.id })
        user.isOnline = true
        user = await User.save(user)

        userToSockerMapping.set(user.id, socket.id)

        logger.verbose(
            `User: ${user.firstName} is now online!, sending update to everyone`
        )

        socket.broadcast.emit('usersListEvent', 'update', [user.publicVersion])
        // TODO: Emit update to every one
    })

    socket.on('getUsers', async (token, userData, callback) => {
        const users = await User.createQueryBuilder('user').getMany()

        logger.verbose(`[getUsers]: found ${users.length} users.`)

        const data = users.map((user) => {
            return {
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id,
                isOnline: userToSockerMapping.has(user.id),
            }
        })

        // logger.debug(data)

        callback({ ok: true, data })
    })
}

export default handleUserEvents
