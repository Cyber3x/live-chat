import { DataSource } from 'typeorm'
import 'dotenv/config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_PORT ?? '3000'),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD?.toString(),
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: true,
    entities: ['src/entities/**/*.ts', 'build/entities/**/*.js'],
    migrations: ['src/migrations/**/*.ts', 'build/migrations/**/*.js'],
    subscribers: [],
})
