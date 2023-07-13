import * as dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import express from 'express'
import { Server } from 'http'

import { AppDataSource } from './data-source'
import { ChatRoom } from './entities/ChatRoom'
import { ChatRoomUsers } from './entities/ChatRoomUsers'
import defaultRouter from './routes/routes'
import { setupSocketIOServer } from './sockets/socket'

AppDataSource.initialize()
    .then(() => {
        const chatRoom = new ChatRoom()
        chatRoom.name = 'Global'

        const chatRoomUsers = new ChatRoomUsers()
        chatRoomUsers.lastReadAt = new Date()
        // chatRoomUsers

        console.log('Data source has been initalized!')
    })
    .catch((err) => {
        console.error('error during data source initalization:', err)
    })

const app = express()

const httpServer = new Server(app)

setupSocketIOServer(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
    },
})

app.use(cors())
app.use(express.json())
app.use('/', defaultRouter)
// app.use(errorHandler)

const PORT = process.env.PORT
httpServer.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
