import XAPI from 'xapi-node'
import { socketStatus } from './utils'

import {
  disconnect,
  buySellGold,
  updateStoploss,
  writeAllSymbols,
  listenForTrades,
  unListenForTrades,
} from './api'

const ctrlC = '\u0003'
const ctrlD = '\u0004'
const carriage = ['\n', '\r', '\r\n']

type KeyMap = {
  "\u0003": (xapi: XAPI) => Promise<void>
  "\u0004": (xapi: XAPI) => Promise<void>
}

function setupStdin () {
  process.stdin.setEncoding('utf8')
  process.stdin.setRawMode(true) // false sends chunk after enter is pressed
  process.stdin.resume() // running in parent process event loop
}

export default function (xapi: XAPI) {
  console.log('Socket is:', socketStatus(xapi))

  const keyMap = {
    [ctrlC]: disconnect,
    [ctrlD]: disconnect,
    1: listenForTrades,
    2: unListenForTrades,
    3: buySellGold,
    4: writeAllSymbols,
    5: updateStoploss,
  }

  setupStdin()

  process.stdin.on('data', async function ( data: Buffer ) {
    process.stdout.write('\n' + JSON.stringify(data) + ' ')

    const key = data.toString() as keyof KeyMap

    if (key in keyMap) {
      // xapi is being hoisted from the outer function
      await keyMap[ key ]( xapi )
    }
    else if (carriage.includes(key)) {
      process.stdout.write('\n')
    }
    else {
      process.stdout.write('does nothing\n')
      for (const key in keyMap) {
        process.stdout.write(JSON.stringify(key) + ' ')
        const func = keyMap[key as keyof KeyMap]
        process.stdout.write(func.name + '\n')
      }
    }

  })
}
