import XAPI from 'xapi-node'
import stdIn from './stdIn'
import { setup as setupStdin } from './stdIn'
import { socketStatus } from './utils'

export default function (xapi: XAPI) {
  console.log('Socket is:', socketStatus(xapi))
  setupStdin()
  process.stdin.on('data', (data) => stdIn(data, xapi))
}
