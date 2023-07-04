"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "live_chat",
    synchronize: true,
    logging: true,
    entities: ["src/entities/**/*.ts", "build/entities/**/*.js"],
    subscribers: [],
    migrations: [],
});
