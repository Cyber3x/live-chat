import { Socket, Server } from 'socket.io'
import { CLIENT_MESSAGE, TClientMessagePayload } from './eventTypes/fromClient'
import { SERVER_MESSAGE, TServerMessagePayload } from './eventTypes/fromServer'

const handleMessageEvents = (io: Server, socket: Socket) => {
    socket.on(CLIENT_MESSAGE, (data: TClientMessagePayload) => {
        const { userData: senderData, message } = data

        console.log(`${senderData.firstName} says: ${message}`)

        const payload: TServerMessagePayload = {
            senderData,
            message,
            sentAt: new Date().toDateString(),
        }

        socket.broadcast.emit(SERVER_MESSAGE, payload)
    })
}

export default handleMessageEvents
