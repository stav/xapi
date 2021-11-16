import DebugLogger from './debug'
import { logTradeToFile, TradeRecord } from './trade'
import { logInfoToConsole, logInfoToFile } from './info'
import { logErrorToConsole, logErrorToFile } from './error'

/** @name KingLogger
 **/
export default class Logger {

  debug: DebugLogger

  constructor() {
    this.debug = new DebugLogger()
  }

  static info(...messages: any[]) {
    if (process.env.NODE_ENV === 'test') {
      logInfoToFile(...messages)
    }
    else {
      logInfoToConsole(...messages)
    }
  }

  static error(e?: unknown, ...optionalParams: any[]): void {
    logErrorToConsole(e, optionalParams)
    logErrorToFile(e, optionalParams)
  }


  info(...messages: any[]) {
    Logger.info(...messages)
  }

  error(e?: unknown, ...optionalParams: any[]): void {
    Logger.error(e, ...optionalParams)
  }

  trade(trade: TradeRecord): void {
    logTradeToFile(trade)
  }

}
