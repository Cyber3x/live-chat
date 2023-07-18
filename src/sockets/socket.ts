import { Server as HTTPServer } from 'http'
import { Server, ServerOptions, Socket } from 'socket.io'
import handleMessageEvents from './messageEvents'
import handleUserEvents from './userEvents'
import {
    ClientToServerEvents,
    InterServerEvent,
    ServerToClientEvents,
    SocketData,
} from './eventTypes'
import { allUsers } from './serverState'

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
            console.log(`${socket.id} user just connected`)

            handleMessageEvents(io, socket)
            handleUserEvents(io, socket)

            socket.on('disconnect', () => {
                allUsers.forEach((user) => {
                    if (user.socketId === socket.id) {
                        user.isOnline = false
                        console.log(
                            `User: ${user.firstName} has disconnected with socketID: ${user.socketId}`
                        )
                        socket.broadcast.emit('usersListEvent', 'update', [
                            user,
                        ])
                    }
                })
            })
        })
}
