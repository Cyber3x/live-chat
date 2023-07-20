import 'dotenv/config'

import cors from 'cors'
import express from 'express'
import { Server } from 'http'

import { AppDataSource } from './data-source'
import defaultRouter from './routes/routes'
import { setupSocketIOServer } from './sockets/socket'
import { bootstrapServerState } from './sockets/serverState'
let retryTries = 5
;(async () => {
    try {
        while (retryTries > 0) {
            try {
                await AppDataSource.initialize()
                console.log('Backned connected to DB')
                break
            } catch (error) {
                retryTries--
                console.log(
                    'Connection to DB Failed, waiting 5 secs, retries left:',
                    retryTries,
                    error
                )
                await new Promise((resolve) => setTimeout(resolve, 5000))
            }
        }
        await bootstrapServerState()

        console.log('Data source has been initalized!')
    } catch (err) {
        console.error('error during data source initalization:', err)
    }
})()

const app = express()

const httpServer = new Server(app)

setupSocketIOServer(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
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
