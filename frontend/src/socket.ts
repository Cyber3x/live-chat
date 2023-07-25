import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@backend/sockets/eventTypes"
import { io, Socket } from "socket.io-client"

const URL = "http://localhost:4000"

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  URL,
  { autoConnect: false }
)
