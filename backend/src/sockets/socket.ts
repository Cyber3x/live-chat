import { Server as HTTPServer } from 'http'
import { Server, ServerOptions, Socket } from 'socket.io'
import {
    ClientToServerEvents,
    InterServerEvent,
    ServerToClientEvents,
    SocketData,
} from './eventTypes'
import { logger } from '../utils/logger'
import { User } from '../entities/User'
import {
    handleChatRoomEvents,
    handleMessageEvents,
    handleUserEvents,
} from './eventHandlers'

export type TSocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvent,
    SocketData
>
export type TSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvent,
    SocketData
>

export let io: TSocketServer

export const userToSockerMapping = new Map<number, string>()

export const setupSocketIOServer = (
    httpServer: HTTPServer,
    options?: Partial<ServerOptions>
) => {
    io = new Server(httpServer, options)

    console.clear()

    io
        // .use((socket, next) => {
        //     if (socket.handshake.auth) {
        //         const jwtPayload = jwt.verify(
        //             socket.handshake.auth,
        //             process.env.JWT_TOKEN_SECRET
        //         ) as TJWTPayload
        //     }
        // })
        .on('connection', (socket) => {
            logger.socket(`${socket.id} user just connected`)

            handleMessageEvents(io, socket)
            handleUserEvents(io, socket)
            handleChatRoomEvents(io, socket)

            socket.on('disconnect', () => {
                userToSockerMapping.forEach(async (sockerId, userId) => {
                    if (sockerId === socket.id) {
                        logger.socket(
                            `User: ${userId} has disconnected with socketID: ${sockerId}`
                        )

                        let user = await User.findOneByOrFail({ id: userId })
                        user.isOnline = false
                        user = await User.save(user)

                        userToSockerMapping.delete(userId)

                        socket.broadcast.emit('usersListEvent', 'update', [
                            user.publicVersion,
                        ])
                    }
                })
            })
        })
}
