import { ChatRoom } from '../entities/ChatRoom'
import { Message } from '../entities/Message'
import { TUser, User } from '../entities/User'
import ChatRoomSrvModel from './ChatRoomSrvModel'

export const allUsers = new Map<number, TUser>()

export const chatRooms: ChatRoomSrvModel[] = []

export async function bootstrapServerState() {
    console.log('Bootstrap: starting')

    const globalRoom = new ChatRoomSrvModel(0, 'Global', null, [], [])

    const globalMessages = await Message.createQueryBuilder('message')
        .innerJoinAndSelect('message.sentBy', 'sender')
        .where('message.chatRoom IS NULL')
        .getMany()

    globalMessages.forEach((message) => {
        globalRoom.addMessage({
            message: message.message,
            senderData: message.sentBy,
            sentAt: message.createdAt,
        })
    })

    chatRooms.push(globalRoom)

    const usersRaw = await User.find()
    usersRaw.forEach((userRaw) => {
        const newUser = {
            ...userRaw.publicVersion,
            isOnline: false,
        }
        chatRooms[0].addUser(newUser.id)
        allUsers.set(newUser.id, newUser)
    })

    const chatRoomsRaw = await ChatRoom.createQueryBuilder('chatRoom')
        .innerJoinAndSelect('chatRoom.createdBy', 'creator')
        .innerJoinAndSelect('chatRoom.chatRoomUsers', 'chatRoomUsers')
        .innerJoinAndSelect('chatRoomUsers.user', 'user')
        .leftJoinAndSelect('chatRoom.messages', 'messages')
        .leftJoinAndSelect('messages.sentBy', 'sender')
        .getMany()

    console.log('all chat rooms raw:', chatRoomsRaw)

    chatRoomsRaw.forEach((chatRoomRaw) => {
        const newChatRoom = new ChatRoomSrvModel(
            chatRoomRaw.id,
            chatRoomRaw.name,
            chatRoomRaw.createdBy.id,
            chatRoomRaw.chatRoomUsers.map(
                (chatRoomUserEntry) => chatRoomUserEntry.user.id
            ),
            chatRoomRaw.messages.map((message) => {
                return {
                    senderData: message.sentBy.publicVersion,
                    message: message.message,
                    sentAt: message.createdAt,
                }
            })
        )

        chatRooms.push(newChatRoom)
    })
    console.log('all chat rooms loaded: ', chatRooms)
    console.log('Bootstrap: done')
}
