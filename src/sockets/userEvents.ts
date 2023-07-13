import { TUserData } from '../controllers/auth/login'
import ChatRoom from './ChatRoom'
import { TSocket, TSocketServer } from './socket'

export type TUserStatus = TUserData & { isOnline: boolean; socketId: string }

export type TMessage = {
    message: string
    senderData: TUserData
    sentAt: string
}

export const allUsers: TUserStatus[] = []

export const chatRooms: ChatRoom[] = [new ChatRoom('Global', null, [])]

const GLOBAL_CHAT_ROOM = 0

function getUserById(id: number): TUserStatus {
    const creator = allUsers.find((user) => id === user.id)

    if (!creator) {
        throw new Error(
            "MAJOR ERROR, user was not found but. But he couldn't have gotten here if he doesn't exist"
        )
    }

    return creator
}

const handleUserEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('newConnection', (token, userData) => {
        // TODO: verify token

        const user = allUsers.find(({ id }) => userData.id === id)

        if (user) {
            // user already registered someday, he's in the users listt
            user.isOnline = true
            user.socketId = socket.id

            console.log(
                `User: ${user.firstName} is now online!, sending update to everyone`
            )

            socket.broadcast.emit('usersListEvent', 'update', [user])
        } else {
            const newUser: TUserStatus = {
                ...userData,
                isOnline: true,
                socketId: socket.id,
            }

            allUsers.push(newUser)

            chatRooms[GLOBAL_CHAT_ROOM].allUsers.push(newUser)

            console.log(
                `Adding new user ${userData.firstName} to Global chat and sending update to every one`
            )

            socket.broadcast.emit('usersListEvent', 'add', [newUser])
        }
        socket.emit('usersListEvent', 'pushAll', allUsers)

        // Push to user all rooms of whom he's a part of
        const roomsWithThisUser = chatRooms.filter((chatRoom) =>
            chatRoom.allUsers.map((u) => u.id).includes(userData.id)
        )
        if (roomsWithThisUser.length > 0) {
            socket.emit('chatRoomsListEvent', 'pushAll', roomsWithThisUser)
        }
    })

    socket.on(
        'createChatRoom',
        (token, userData, chatRoomName, userIds, callback) => {
            // TODO: verify sender token

            // FIXME: don't create a room if the room with same users exists

            const newChatRoom = new ChatRoom(
                chatRoomName,
                getUserById(userData.id),
                userIds.map(getUserById)
            )

            console.log(
                `User: ${
                    userData.firstName
                } is creating a chat room with: ${newChatRoom.allUsers
                    .map((user) => user.firstName)
                    .join(', ')}`
            )

            newChatRoom.allUsers.forEach((user) => {
                console.log(
                    `Adding user: ${user.firstName} to chatRoom: ${newChatRoom.name}`
                )
            })

            chatRooms.push(newChatRoom)

            callback(newChatRoom.id)

            newChatRoom.allUsers.forEach((user) => {
                io.to(user.socketId).emit('chatRoomsListEvent', 'add', [
                    newChatRoom,
                ])
            })
        }
    )
}

export default handleUserEvents
