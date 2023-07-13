import { TSocket, TSocketServer } from './socket'
import { TMessage, chatRooms } from './userEvents'

export type TChatMessage = TMessage & { isSentByMe: boolean }

const handleMessageEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('clientMessage', (token, senderData, message, targetRoomId) => {
        // TODO: verify token

        const newMessage: TMessage = {
            senderData,
            message,
            sentAt: new Date().toDateString(),
        }

        const targetRoom = chatRooms.find(
            (chatRoom) => chatRoom.id === targetRoomId
        )

        // TODO: verify if room with that id exists, but it should :)
        if (!targetRoom) {
            throw new Error(
                `target room with id: ${targetRoomId} not found. But we shouldn't be here`
            )
        }

        targetRoom.messages.unshift(newMessage)

        console.log(
            `${senderData.firstName} in room: ${targetRoom.name} with ${targetRoom.allUsers.length} people says: ${message}`
        )

        targetRoom.allUsers.forEach((user) => {
            io.to(user.socketId).emit(
                'serverMessage',
                {
                    ...newMessage,
                    isSentByMe: socket.id === user.socketId,
                },
                targetRoomId
            )
        })
    })
}

export default handleMessageEvents
