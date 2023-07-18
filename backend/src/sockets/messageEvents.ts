import { ChatRoom } from '../entities/ChatRoom'
import { Message, TMessage } from '../entities/Message'
import { User } from '../entities/User'
import { chatRooms } from './serverState'
import { TSocket, TSocketServer } from './socket'

const saveMessage = async (
    senderId: number,
    message: string,
    targetRoomId: number
): Promise<TMessage> => {
    const isGlobalChatRoomTarget = targetRoomId === 0

    let messageSender = await User.findOneOrFail({
        where: {
            id: senderId,
        },
        relations: ['sentMessages'],
    })

    let newMessage: Message

    if (isGlobalChatRoomTarget) {
        newMessage = await Message.save({
            message: message,
            sentBy: messageSender,
        })
    } else {
        const messageChatRoom = await ChatRoom.findOneOrFail({
            where: {
                id: targetRoomId,
            },
            relations: ['messages'],
        })

        newMessage = await Message.save({
            chatRoom: messageChatRoom,
            message: message,
            sentBy: messageSender,
        })

        messageChatRoom.messages.push(newMessage)
        await ChatRoom.save(messageChatRoom)
    }

    messageSender.sentMessages.push(newMessage)
    messageSender = await User.save(messageSender)

    const newMessagePublic: TMessage = {
        message: message,
        senderData: messageSender.publicVersion,
        sentAt: newMessage.createdAt,
    }

    console.log('messgeenvets ln 55:', newMessage)

    return newMessagePublic
}

const handleMessageEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on(
        'clientMessage',
        async (token, senderData, message, targetRoomId) => {
            // TODO: verify token

            const newMessage = await saveMessage(
                senderData.id,
                message,
                targetRoomId
            )

            const targetRoom = chatRooms.find(
                (chatRoom) => chatRoom.id === targetRoomId
            )

            if (!targetRoom) {
                throw new Error(
                    `Target chat room with id: ${targetRoom} not found in server memory, but it should be loaded`
                )
            }

            targetRoom.addMessage(newMessage)

            console.log(
                `${senderData.firstName} in room: ${targetRoom.name} with ${targetRoom.numberOfUsers} people says: ${message}`
            )

            for (const user of targetRoom.users) {
                if (!user.isOnline) {
                    console.log(`Skipping user ${user.firstName} he's offline`)
                    continue
                }

                if (!user.socketId) {
                    console.log(`User: ${user.firstName} doesn't have socketId`)
                    continue
                }

                console.log(
                    `sending ${newMessage.message} to ${user.firstName} in room: ${targetRoomId}`
                )

                io.to(user.socketId).emit(
                    'serverMessage',
                    newMessage,
                    targetRoomId
                )
            }
        }
    )
}

export default handleMessageEvents
