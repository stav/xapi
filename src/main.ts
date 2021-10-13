import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

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

type KeyMap = {
  "\u0003": (xapi: XAPI) => Promise<void>
  "\u0004": (xapi: XAPI) => Promise<void>
}

export default async function (xapi: XAPI) {
  console.log('Socket is:', ConnectionStatus[xapi.Socket.status])

  const keyMap = {
    [ctrlC]: disconnect,
    [ctrlD]: disconnect,
    1: listenForTrades,
    2: unListenForTrades,
    3: buySellGold,
    4: writeAllSymbols,
    5: updateStoploss,
  }

  const stdin = process.stdin
  stdin.setEncoding('utf8')
  stdin.setRawMode(true) // false sends chunk after enter is pressed
  await stdin.resume() // running in parent process event loop

  await stdin.on('data', async function ( data: Buffer ) {
    // xapi is being hoisted from (main) the outer function
    process.stdout.write(JSON.stringify(data) + ' ')
    const key = data.toString()

    if ( key in keyMap ) {
      await keyMap[key as keyof KeyMap](xapi)
    }
    else {
      process.stdout.write('does nothing\n')
    }

  })
}
