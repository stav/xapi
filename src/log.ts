import fs from 'fs'
import stream from 'stream'

import { STREAMING_TRADE_RECORD, TRADE_TRANS_INFO } from 'xapi-node'

type TradeRecord = STREAMING_TRADE_RECORD | TRADE_TRANS_INFO

function nothing() {}

interface Params {
  reason: string
}

interface GeneralError {
  message?: string
  params?: Params
}

async function logErrorToConsole (_e: unknown, ...data: any[]): Promise<void> {
  const e: GeneralError = <GeneralError>_e
  let message = ''
  if (e.message) {
    message += ' | ' + e.message
  }
  if (e.params?.reason) {
    message += ' | ' + JSON.stringify(e.params.reason)
  }
  if (!message) {
    message = e.toString()
  }
  console.error('ERROR:', message.replace(/^[\s|]+/, ''), ...data)
}

export function logTradeToFile (trade: TradeRecord): void {
  try {
    const json: string = JSON.stringify(trade) + '\n'
    fs.appendFile('./log/trades.jsonl', json, nothing)
  }
  catch (e: unknown) {
    logErrorToConsole(e, trade)
  }
}

export function logErrorToFile (e: unknown, optionalParams: any[]): void {
  try {
    const json = JSON.stringify([e, ...optionalParams]) + '\n'
    fs.appendFile('./log/error', json, nothing)
  }
  catch (e: unknown) {
    logErrorToConsole(e, optionalParams)
  }
}

export class DebugLogger extends stream.Writable {
  _write(chunk: string | Buffer | Uint8Array, encoding: string, next: Function): void {
    try {
      fs.appendFile('./log/debug.log', chunk.toString() + '\n', nothing)
      next()
    }
    catch (e: unknown) {
      logErrorToConsole(e, chunk)
    }
  }
}

export default class KingLogger {

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
