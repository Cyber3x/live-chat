import { ChatRoom } from '../entities/ChatRoom'
import { ChatRoomUsers } from '../entities/ChatRoomUsers'
import { User } from '../entities/User'
import ChatRoomSrvModel from './ChatRoomSrvModel'
import { allUsers, chatRooms } from './serverState'
import { TSocket, TSocketServer } from './socket'

const handleUserEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('newConnection', async (token, userData) => {
        // TODO: verify token

        const user = allUsers.get(userData.id)

        if (user) {
            // user already registered someday, he's in the users listt
            user.isOnline = true
            user.socketId = socket.id

            console.log(
                `User: ${user.firstName} is now online!, sending update to everyone`
            )

            allUsers.set(user.id, user)

            socket.broadcast.emit('usersListEvent', 'update', [user])
        } else {
            const userRaw = await User.findOneOrFail({
                where: { id: userData.id },
            })

            const user = userRaw.publicVersion
            user.socketId = socket.id

            chatRooms[0].addUser(user.id)

            allUsers.set(user.id, user)
            socket.broadcast.emit('usersListEvent', 'add', [user])
        }

        socket.emit('usersListEvent', 'pushAll', Array.from(allUsers.values()))

        // Push to user all rooms of whom he's a part of
        const roomsWithThisUser = chatRooms.filter((chatRoom) =>
            chatRoom.userIds.includes(userData.id)
        )

        console.log(roomsWithThisUser)
        if (roomsWithThisUser.length > 0) {
            socket.emit('chatRoomsListEvent', 'pushAll', roomsWithThisUser)
        }
    })

    socket.on(
        'createChatRoom',
        async (token, userData, chatRoomName, userIds, callback) => {
            // TODO: verify sender token

            // FIXME: don't create a room if the room with same users exists

            // find the User who will be the creator of the room
            const chatRoomCreator = await User.findOneByOrFail({
                id: userData.id,
            })

            // create a room
            let newChatRoom = await ChatRoom.save({
                name: chatRoomName,
                createdBy: chatRoomCreator,
                chatRoomUsers: [],
            })

            // for all involved users make entries in the ChatRoomUsers bridge table
            const myUserIds = [...userIds]
            myUserIds.push(userData.id)
            myUserIds.forEach(async (userId) => {
                const userParticipant = await User.findOneByOrFail({
                    id: userId,
                })

                console.log(
                    `Adding user: ${userParticipant.firstName} to chatRoom: ${newChatRoom.name}`
                )

                // connect a user with a room
                const newChatRoomUserEntry = ChatRoomUsers.create({
                    chatRoom: newChatRoom,
                    lastReadAt: new Date(),
                    user: userParticipant,
                })
                await ChatRoomUsers.save(newChatRoomUserEntry)

                // TODO: i think here i need to save the newcahtroomuserenty to the userParticinapts for backlink

                // add that connection to the room so it knows what users are in it
                newChatRoom.chatRoomUsers.push(newChatRoomUserEntry)
            })

            // save all those connections to the chat room
            newChatRoom = await ChatRoom.save(newChatRoom)

            const newChatRoomServerModel = new ChatRoomSrvModel(
                newChatRoom.id,
                newChatRoom.name,
                userData.id,
                myUserIds,
                []
            )

            console.log(
                `User: ${
                    userData.firstName
                } is creating a chat room with: ${newChatRoomServerModel.users
                    .map((user) => user.firstName)
                    .join(', ')}`
            )

            chatRooms.push(newChatRoomServerModel)

            for (const user of newChatRoomServerModel.users) {
                if (!user.isOnline) {
                    console.log(`Skipping user ${user.firstName} he's offline`)
                    continue
                }

                if (!user.socketId) {
                    console.log(`User: ${user.firstName} doesn't have socketId`)
                    continue
                }

                io.to(user.socketId).emit('chatRoomsListEvent', 'add', [
                    newChatRoomServerModel,
                ])
            }

            callback(newChatRoomServerModel.id)
        }
    )
}

export default handleUserEvents
