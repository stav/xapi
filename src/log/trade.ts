import fs from 'fs'

import { STREAMING_TRADE_RECORD, TRADE_TRANS_INFO } from 'xapi-node'

import { logErrorToConsole } from './error'

export type TradeRecord = STREAMING_TRADE_RECORD | TRADE_TRANS_INFO

export function logTradeToFile (trade: TradeRecord): void {
  try {
    const json: string = JSON.stringify(trade) + '\n'
    fs.appendFile('./log/trades.jsonl', json, ()=>{})
  }
  catch (e: unknown) {
    logErrorToConsole(e, trade)
  }
}
