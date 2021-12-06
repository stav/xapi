import DebugLogger from './debug'
import { logError } from './error'
import { logMessageToFile } from './file'
import { printInfoToConsole } from './info'
import { logTradeToFile, TradeRecord } from './trade'

/**
 */
export default class Logger {

  debug: DebugLogger

  constructor() {
    this.debug = new DebugLogger()
  }

  static info(...messages: any[]) {
    if (process.env.NODE_ENV === 'test') {
      logMessageToFile('info', ...messages)
    }
    else {
      printInfoToConsole(...messages)
    }
  }

  static error(e?: unknown, ...optionalParams: any[]): void {
    logError(e, ...optionalParams)
  }

  static file(fileName: string, ...content: any[]): void {
    logMessageToFile(fileName, ...content)
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
