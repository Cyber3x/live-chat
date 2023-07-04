import * as express from 'express'
import defaultRouter from './routes/routes'
import { AppDataSource } from './data-source'

AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initalized!')
    })
    .catch((err) => {
        console.error('error during data source initalization:', err)
    })

const app = express()
const PORT = 3000
app.use(express.json())

app.use('/', defaultRouter)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
