import {
  CMD_FIELD,
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

type TradeRecords = TRADE_RECORD[] | STREAMING_TRADE_RECORD[]
type NumberMap = Map<number, Array<number>>
type StringMap = Map<number, Array<string>>
type PriceMap = NumberMap | StringMap
type PriceFamilys = [PriceMap, PriceMap, PriceMap]

/** getTradesFamilys
 **
 ** This function groups all trades into what is called a "family" keyed by "price".
 ** In other words all trades with the same entry price belong to the same family.
 **
 ** @todo This would be better served by grouping by the "position" field or even
 **       the "customComment" field but unfortunately these fields are unreliable.
 **
 ** Example, the following nine (9) orders:
 **   1. Order 314327066 314307379 314327066 BUY GOLD @ 1782.07 SL 1765 TP 1797
 **   2. Order 314327067 314307378 314327067 BUY GOLD @ 1782.07 SL 1765 TP 1792
 **   3. Order 314327068 314307377 314327068 BUY GOLD @ 1782.07 SL 1765 TP 1789
 **   4. Order 314327069 314307375 314327069 BUY GOLD @ 1782.07 SL 1765 TP 1786
 **   5. Order 314327070 314307374 314327070 BUY GOLD @ 1782.07 SL 1765 TP 1784
 **   6. Order 314391975 314391975 314391975 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4140
 **   7. Order 314391976 314391976 314391976 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4100
 **   8. Order 314391977 314391977 314391977 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4150
 **   9. Order 314391978 314391978 314391978 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4160
 **
 ** Produce two (2) familys:
 **
 **   Price 1782.07 ['BUY'] ['GOLD'] TPs [ 1784, 1786, 1789, 1792, 1797 ]
 **   Price 4200 ['SELL_STOP'] ['ETHEREUM'] TPs [ 4160, 4150, 4140, 4100 ]
 **
 ** @returns a 3-member Tuple of Maps keyed on price
 **
 ** Example: [
 **   Map(2) { 1782.07 => [ 1784, 1786, 1789, 1792, 1797 ],
 **            4200 => [ 4160, 4150, 4140, 4100 ] },
 **   Map(2) { 1782.07 => [ 'BUY' ], 4200 => [ 'SELL_STOP' ] },
 **   Map(2) { 1782.07 => [ 'GOLD' ], 4200 => [ 'ETHEREUM' ] }
 ** ]
 **/
function getTradesFamilys(trades: TradeRecords): PriceFamilys {
  const priceTpMap = new Map()
  const priceTypeMap = new Map()
  const priceSymbolMap = new Map()
  // First loop thru trades to create three (3) Map<number, Set>
  for (const trade of trades) {
    const price = trade.open_price
    const tps = priceTpMap.get(price) || new Set()
    const types = priceTypeMap.get(price) || new Set()
    const symbols = priceSymbolMap.get(price) || new Set()
    tps.add(trade.tp)
    types.add(CMD_FIELD[trade.cmd])
    symbols.add(trade.symbol)
    priceTpMap.set(price, tps)
    priceTypeMap.set(price, types)
    priceSymbolMap.set(price, symbols)
  }
  // Then spin thru all the maps and replace Set values with Array values
  for (const [price, tpsSet] of priceTpMap) {
    const symbols = [...priceSymbolMap.get(price) as Set<string>]
    const types = [...priceTypeMap.get(price) as Set<string>]
    const tps = [...tpsSet].sort()
    if (types[0].indexOf('SELL') > -1) {
      tps.reverse()
    }
    priceTpMap.set(price, tps)
    priceTypeMap.set(price, types)
    priceSymbolMap.set(price, symbols)
  }
  return [priceTpMap, priceTypeMap, priceSymbolMap]
}

function printFamilys(trades: TradeRecords) {
  if (trades.length > 1) {
    const [ priceTpMap, priceTypeMap, priceSymbolMap ] = getTradesFamilys(trades)
    console.log('Familys', priceTpMap.size)
    // console.log('Familys', priceTpMap.size, priceTpMap, priceTypeMap, priceSymbolMap)
    for (const [price, tps] of priceTpMap) {
      const symbols = [...priceSymbolMap.get(price) as number[]]
      const types = [...priceTypeMap.get(price) as number[]]
      console.log(' Price', price, types, symbols, 'TPs', tps)
    }
  }
}

export function printTrades(trades: TradeRecords) {
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
      trade.profit ? `profit=${trade.profit}` : '\b',
      trade.state ? `(${trade.state})` : '\b',
      trade.customComment ? `"${trade.customComment}"` : '\b',
    )
  }
}
