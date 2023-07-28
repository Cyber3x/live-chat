import { ChatRoom } from '../../entities/ChatRoom'
import { Message } from '../../entities/Message'
import { User } from '../../entities/User'
import { logger } from '../../utils/logger'
import { TMessage } from '../eventTypes'
import { TSocket, TSocketServer, userToSockerMapping } from '../socket'

const handleMessageEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on(
        'clientMessage',
        async (token, senderData, message, targetChatRoomId) => {
            // TODO: verify token

            const messageSender = await User.findOneOrFail({
                where: {
                    id: senderData.id,
                },
                relations: ['sentMessages'],
            })

            const targetChatRoom = await ChatRoom.createQueryBuilder('chatRoom')
                .leftJoinAndSelect('chatRoom.messages', 'message')
                .innerJoinAndSelect('chatRoom.chatRoomUsers', 'chatRoomUsers')
                .innerJoinAndSelect('chatRoomUsers.user', 'user')
                .where('chatRoom.id = :id', { id: targetChatRoomId })
                .getOne()

            if (!targetChatRoom) {
                logger.error(
                    '[clientMessage] cant find target room for message with id: ' +
                        targetChatRoomId
                )
                return
            }

            const newMessage = await Message.save({
                chatRoom: targetChatRoom,
                message: message,
                sentBy: messageSender,
            })

            const newMessageFrontend: TMessage = {
                id: newMessage.id,
                message,
                senderId: senderData.id,
                sentAt: newMessage.createdAt,
            }

            targetChatRoom.messages.push(newMessage)
            await ChatRoom.save(targetChatRoom)

            messageSender.sentMessages.push(newMessage)
            await User.save(messageSender)

            logger.verbose(
                `${senderData.firstName} in room: ${targetChatRoom.name} says: ${message}`
            )

            const chatRoomUsers = targetChatRoom.chatRoomUsers.map(
                (chatRoomUser) => chatRoomUser.user.publicVersion
            )

            for (const user of chatRoomUsers) {
                const socketId = userToSockerMapping.get(user.id)
                if (!socketId) continue

                logger.verbose(
                    `sending: ${newMessage.message} To ${user.firstName} in room: ${targetChatRoom.name}`
                )

                io.to(socketId).emit(
                    'serverMessage',
                    newMessageFrontend,
                    targetChatRoomId
                )
            }
        }
    )
}

export default handleMessageEvents
