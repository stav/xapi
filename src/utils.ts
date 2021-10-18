import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

export const socketStatus = (xapi: XAPI) => ConnectionStatus[xapi.Socket.status]

export function setupStdin () {
  process.stdin.setEncoding('utf8')
  process.stdin.setRawMode(true) // false sends chunk after enter is pressed
  process.stdin.resume() // running in parent process event loop
}
