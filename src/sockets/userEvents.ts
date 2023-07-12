import { TUserData } from '../controllers/auth/login'
import { TSocket, TSocketServer } from './socket'

export type TUserStatus = TUserData & { isOnline: boolean; sockedID: string }

export type TMessage = {
    message: string
}

export type TChatRoom = {
    name: string
    id: number
    users: TUserStatus[]
    messages: TMessage[]
    createdBy: TUserStatus
}

export const allUsers: TUserStatus[] = []

export const chatRooms: TChatRoom[] = []

function getUserById(id: number): TUserStatus {
    const creator = allUsers.find((user) => id === user.id)

    if (!creator) {
        throw new Error(
            "MAJOR ERROR, user was not found but. But he couldn't have gotten here if he doesn't exist"
        )
    }

    return creator
}

let roomIdCounter = 0
function getRoomId(): number {
    roomIdCounter++
    return roomIdCounter
}

const handleUserEvents = (io: TSocketServer, socket: TSocket) => {
    socket.on('newConnection', (token, userData) => {
        // TODO: verify token

        const userIndex = allUsers.findIndex(({ id }) => userData.id === id)

        if (userIndex !== -1) {
            // user is already in the list
            allUsers[userIndex].isOnline = true
            allUsers[userIndex].sockedID = socket.id

            console.log(
                `User: ${allUsers[userIndex].firstName} is now online!, sending update to everyone`
            )

            io.emit('usersListUpdate', allUsers)
            return
        }

        // a new user need to be added to the list
        const newUser: TUserStatus = {
            ...userData,
            isOnline: true,
            sockedID: socket.id,
        }

        allUsers.push(newUser)

        console.log(
            `Adding new user ${userData.firstName} and sending update to every one`
        )

        io.emit('usersListUpdate', allUsers)
    })

    socket.on('createChatRoom', (token, userData, chatRoomName, userIds) => {
        // TODO: verify sender token

        // FIXME: don't create a room if the room with same users exists

        const newChatRoom: TChatRoom = {
            createdBy: getUserById(userData.id),
            // TODO: remove this and get the id from the database when the room is saved
            id: getRoomId(),
            messages: [],
            name: chatRoomName,
            users: userIds.map(getUserById),
        }

        console.log(
            `User: ${
                userData.firstName
            } is creating a chat room with: ${newChatRoom.users
                .map((user) => user.firstName)
                .join(', ')}`
        )

        chatRooms.push(newChatRoom)

        // TODO: ovo nema smisla slati svima, treba poslati korisnicima koji su samo
        // u toj sobi
        io.emit('chatRoomsListUpdate', chatRooms)
    })
}

export default handleUserEvents
