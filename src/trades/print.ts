import {
  CMD_FIELD,
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../bot'
import getFamilyMaps from './getFamilyMaps'

type TradeRecords = TRADE_RECORD[] | STREAMING_TRADE_RECORD[]

function printFamilys(trades: TradeRecords, info: Function): void {
  if (trades.length > 1) {
    const [ tpMap, typeMap, symbolMap ] = getFamilyMaps(trades)
    info('Familys', tpMap.size)
    for (const [key, tps] of tpMap) {
      const symbols = [...symbolMap.get(key) as string[]]
      const types = [...typeMap.get(key) as string[]]
      info(' SL', key, types, symbols, 'TPs', tps)
    }
  }
}

/** @name printTrades
 **/
export function printTrades (this: KingBot, trades: TradeRecords): void {
  printFamilys(trades, this.log.info)
  for (let i=0; i<trades.length; i++) {
    const trade = trades[i]
    this.log.info(
      trades.length > 1 ? `${i+1}.` : '*.',
      'Order', trade.order, trade.order2, trade.position,
      CMD_FIELD[trade.cmd],
      trade.volume,
      trade.symbol,
      '@', trade.open_price,
      'SL', trade.sl,
      'TP', trade.tp,
      trade.profit ? `profit=${trade.profit + trade.storage}` : '\b',
      trade.state ? `(${trade.state})` : '\b',
      trade.customComment ? `"${trade.customComment}"` : '\b',
      trade.comment ? trade.comment : '\b',
    )
  }
}

/** @name printAllTrades
 **/
export async function printAllTrades (this: KingBot): Promise<void> {
  this.log.info('Printing all positions')
  const trades: TRADE_RECORD[] = await this.getAllTrades()
  this.printTrades(trades)
}
