import XAPI from 'xapi-node'
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

export default {
  [ctrlC]: disconnect,
  [ctrlD]: disconnect,
  1: listenForTrades,
  2: unListenForTrades,
  3: buySellGold,
  4: writeAllSymbols,
  5: updateStoploss,
}

export type KeyMap = {
  [ctrlC]: (xapi: XAPI) => Promise<void>
  [ctrlD]: (xapi: XAPI) => Promise<void>
}
