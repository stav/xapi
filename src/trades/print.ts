import {
  CMD_FIELD,
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../kingbot'
import getFamilyMaps from './getFamilyMaps'

type TradeRecords = TRADE_RECORD[] | STREAMING_TRADE_RECORD[]

function printFamilys(trades: TradeRecords): void {
  if (trades.length > 1) {
    const [ tpMap, typeMap, symbolMap ] = getFamilyMaps(trades)
    console.log('Familys', tpMap.size)
    // console.log('Familys', tpMap.size, tpMap, typeMap, symbolMap)
    for (const [key, tps] of tpMap) {
      const symbols = [...symbolMap.get(key) as number[]]
      const types = [...typeMap.get(key) as number[]]
      console.log(' SL', key, types, symbols, 'TPs', tps)
    }
  }
}

/** @name printTrades
 **/
export function printTrades (trades: TradeRecords): void {
  printFamilys(trades)
  for (let i=0; i<trades.length; i++) {
    const trade = trades[i]
    const type = CMD_FIELD[trade.cmd]
    console.info(
      trades.length > 1 ? `${i+1}.` : '*.',
      'Order', trade.order, trade.order2, trade.position,
      type, trade.symbol,
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
  console.info('Printing all positions')
  const trades: TRADE_RECORD[] = await this.getAllTrades()
  this.printTrades(trades)
}
