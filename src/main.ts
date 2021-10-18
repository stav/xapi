import XAPI from 'xapi-node'
import keyMap from './keyMap'
import { KeyMap } from './keyMap'
import { setupStdin, socketStatus } from './utils'

const carriage = ['\n', '\r', '\r\n']

export default function (xapi: XAPI) {
  console.log('Socket is:', socketStatus(xapi))

  setupStdin()

  process.stdin.on('data', stdIn)

  async function stdIn (data: Buffer) {
    process.stdout.write('\n' + JSON.stringify(data) + ' ')

    const key = data.toString() as keyof KeyMap

    // If the key the user pressed is in the map, it's a function, execute it
    if (key in keyMap) {
      // xapi is being hoisted from the outer function
      await keyMap[ key ]( xapi )
    }
    // Else if the key is the enter key ignore it
    else if (carriage.includes(key)) {
      process.stdout.write('\n')
    }
    // Otherwise show the list of valid keys
    else {
      process.stdout.write('does nothing\n')
      for (const _ in keyMap) {
        process.stdout.write(JSON.stringify(_) + ' ')
        const func = keyMap[_ as keyof KeyMap]
        process.stdout.write(func.name + '\n')
      }
    }
  }
}
