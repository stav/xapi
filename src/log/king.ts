import DebugLogger from './debug'
import { logTradeToFile, TradeRecord } from './trade'
import { logErrorToConsole, logErrorToFile } from './error'

/** @name KingLogger
 **/
export default class {

  debug: DebugLogger

  constructor() {
    this.debug = new DebugLogger()
  }

  trade(trade: TradeRecord): void {
    logTradeToFile(trade)
  }

  error(e?: unknown, ...optionalParams: any[]): void {
    logErrorToConsole(e, optionalParams)
    logErrorToFile(e, optionalParams)
  }

}
