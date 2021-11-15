import DebugLogger from './debug'
import { logTradeToFile, TradeRecord } from './trade'
import { logErrorToConsole, logErrorToFile } from './error'

/** @name KingLogger
 **/
export default class Logger {

  debug: DebugLogger

  constructor() {
    this.debug = new DebugLogger()
  }

  trade(trade: TradeRecord): void {
    logTradeToFile(trade)
  }

  error(e?: unknown, ...optionalParams: any[]): void {
    if (process.env.NODE_ENV !== 'test') {
      logErrorToConsole(e, optionalParams)
      logErrorToFile(e, optionalParams)
    }
  }

  info(...message: any[]) {
    Logger.sinfo(...message)
  }

  static sinfo(...message: any[]) {
    if (process.env.NODE_ENV !== 'test') {
      console.info(...message)
    }
  }

}
