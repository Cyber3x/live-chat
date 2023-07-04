import * as express from 'express'
import defaultRouter from './routes/routes'
import { AppDataSource } from './data-source'
import 'dotenv/config'

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

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
