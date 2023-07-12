import { TSocket, TSocketServer } from './socket'

const handleMessageEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('clientMessage', (token, senderData, message) => {
        console.log(`${senderData.firstName} says: ${message}`)

        socket.broadcast.emit(
            'serverMessage',
            senderData,
            message,
            new Date().toDateString()
        )
    })
}

export default handleMessageEvents
