import { io } from "socket.io-client"

const URL = "http://localhost:4000"

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const socket = io(URL, { autoConnect: false })
