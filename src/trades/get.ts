import {
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../bot'

/** @name getAllTrades
 **/
export async function getAllTrades (this: KingBot): Promise<TRADE_RECORD[]> {
  // Basic info already available in xapi.positions
  const result = await this.xapi.Socket.send.getTrades().catch(this.log.error)
  if (!result) {
    return []
  }
  const trades: TRADE_RECORD[] = JSON.parse(result.json).returnData
  return trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
}

/** @name getFamilyTrades
 **/
export async function getFamilyTrades (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<TRADE_RECORD[]> {
  let trades: TRADE_RECORD[] = await this.getAllTrades()
  trades = trades.filter((trade: TRADE_RECORD) => trade.sl === data.sl)
  console.log('Family trades', trades.length)
  this.printTrades(trades)
  return trades
}
