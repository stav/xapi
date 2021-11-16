import {
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../../bot'

const trades: TRADE_RECORD[] = [
  {
    cmd: 0,
    order: 74148499,
    digits: 3,
    offset: 0,
    order2: 316311957,
    position: 316311823,
    symbol: 'LITECOIN',
    comment: '[T/P]',
    customComment: 'x163638810730200390_K1NGbot 1636388101247 TP1',
    commission: -0.22,
    storage: 0,
    margin_rate: 0,
    close_price: 219.162,
    open_price: 218.105,
    // nominalValue: null,
    profit: 105.7,
    volume: 100,
    sl: 208.9,
    tp: 219.13,
    closed: true,
    type: 2,
    open_time: 1636388387805,
    close_time: 1636388522896,
    expiration: 0,
    // state: 'Modified'
  }
]

/** @name getAllTrades
 **/
export async function getAllTrades (this: KingBot): Promise<TRADE_RECORD[]> {
  return trades
}

/** @name getFamilyTrades
 **/
export async function getFamilyTrades (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<TRADE_RECORD[]> {
  const familyTrades = trades.map(trade => Object.assign({}, trade, { sl: data.sl }))
  this.log.info('Family trades', trades.length)
  this.printTrades(trades)
  return familyTrades
}
