import { DataSource } from 'typeorm'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'live_chat',
    synchronize: true,
    logging: true,
    entities: ['src/entities/**/*.ts', 'build/entities/**/*.js'],
    migrations: ['src/migrations/**/*.ts', 'build/migrations/**/*.js'],
    subscribers: [],
})
