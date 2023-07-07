import * as dotenv from 'dotenv'
dotenv.config()
import * as express from 'express'
import { AppDataSource } from './data-source'
import defaultRouter from './routes/routes'
import * as cors from 'cors'

AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initalized!')
    })
    .catch((err) => {
        console.error('error during data source initalization:', err)
    })

const app = express()

app.use(cors())
app.use(express.json())
app.use('/', defaultRouter)
// app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
