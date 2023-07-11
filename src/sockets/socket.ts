import { Server as HTTPServer } from 'http'
import { Server, ServerOptions } from 'socket.io'
import { USERS_LIST_UPDATE } from './eventTypes/fromServer'
import handleMessageEvents from './messageEvents'
import handleUserEvents, { USERS } from './userEvents'

export let io: Server

export const setupSocketIOServer = (
    httpServer: HTTPServer,
    options?: Partial<ServerOptions>
) => {
    io = new Server(httpServer, options)

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
                USERS.forEach((user) => {
                    if (user.sockedID === socket.id) {
                        user.isOnline = false
                        console.log(
                            `User: ${user.firstName} has disconnected with socketID: ${user.sockedID}`
                        )
                    }
                })
                socket.broadcast.emit(USERS_LIST_UPDATE, { users: USERS })
            })
        })
}
