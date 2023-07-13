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

        const newUser: TUserStatus = {
            ...userData,
            isOnline: true,
            socketId: socket.id,
        }

        // Push to user all rooms of whom he's a part of
        const roomsWithThisUser = chatRooms.filter((chatRoom) =>
            chatRoom.allUsers.map((u) => u.id).includes(userData.id)
        )
        if (roomsWithThisUser.length > 0) {
            socket.emit('chatRoomsListEvent', 'pushAll', roomsWithThisUser)
        }

        const user = allUsers.find(({ id }) => userData.id === id)

        if (user) {
            // user is already in the list
            user.isOnline = true
            user.socketId = socket.id

            console.log(
                `User: ${user.firstName} is now online!, sending update to everyone`
            )

            socket.emit('usersListEvent', 'pushAll', allUsers)
            socket.broadcast.emit('usersListEvent', 'update', [user])
            return
        }

        allUsers.push(newUser)

        // Add user to the global chat room
        chatRooms[0].allUsers.push(newUser)

        console.log(
            `Adding new user ${userData.firstName} to Global chat and sending update to every one`
        )

        socket.emit('usersListEvent', 'pushAll', allUsers)
        socket.broadcast.emit('usersListEvent', 'add', [newUser])
    })

    socket.on('createChatRoom', (token, userData, chatRoomName, userIds) => {
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

        newChatRoom.allUsers.forEach((user) => {
            io.to(user.socketId).emit('chatRoomsListEvent', 'add', [
                newChatRoom,
            ])
        })
    })
}

export default handleUserEvents
