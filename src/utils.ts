import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

export const socketStatus = (xapi: XAPI) => ConnectionStatus[xapi.Socket.status]
