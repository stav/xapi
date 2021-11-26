import DebugLogger from './debug'
import { logTradeToFile, TradeRecord } from './trade'
import { printInfoToConsole, logInfoToFile } from './info'
import { printErrorToConsole, logErrorToFile } from './error'

/**
 */
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
      printInfoToConsole(...messages)
    }
  }

  static error(e?: unknown, ...optionalParams: any[]): void {
    logErrorToFile(e, optionalParams)
    if (process.env.NODE_ENV !== 'test') {
      printErrorToConsole(e, optionalParams)
    }
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
