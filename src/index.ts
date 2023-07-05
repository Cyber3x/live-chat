import * as dotenv from 'dotenv'
dotenv.config()
import * as express from 'express'
import { AppDataSource } from './data-source'
import defaultRouter from './routes/routes'

AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initalized!')
    })
    .catch((err) => {
        console.error('error during data source initalization:', err)
    })

const app = express()

app.use(express.json())
app.use('/', defaultRouter)
// app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
