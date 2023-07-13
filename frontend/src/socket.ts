import { io, Socket } from "socket.io-client"
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../src/sockets/eventTypes"

const URL = "http://localhost:4000"

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  { autoConnect: false }
)
