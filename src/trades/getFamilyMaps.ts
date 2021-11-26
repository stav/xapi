import {
  CMD_FIELD,
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

type TradeRecords = TRADE_RECORD[] | STREAMING_TRADE_RECORD[]
type NumberMap = Map<number, Array<number>>
type StringMap = Map<number, Array<string>>
type FamilyMaps = [NumberMap, StringMap, StringMap]

/** @name getFamilyMaps */
/**
 * Group all trades into what is called a _"family"_ keyed by `sl`. In other
 * words all trades with the same _stop loss_ belong to the same family.
 *
 * Example, the following nine (9) orders:
 *
 * 1. Order 314327066 314307379 314327066 BUY GOLD @ 1782.07 SL 1765 TP 1797
 * 2. Order 314327067 314307378 314327067 BUY GOLD @ 1782.07 SL 1765 TP 1792
 * 3. Order 314327068 314307377 314327068 BUY GOLD @ 1782.07 SL 1765 TP 1789
 * 4. Order 314327069 314307375 314327069 BUY GOLD @ 1782.07 SL 1765 TP 1786
 * 5. Order 314327070 314307374 314327070 BUY GOLD @ 1782.07 SL 1765 TP 1784
 * 6. Order 314391975 314391975 314391975 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4140
 * 7. Order 314391976 314391976 314391976 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4100
 * 8. Order 314391977 314391977 314391977 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4150
 * 9. Order 314391978 314391978 314391978 SELL_STOP ETHEREUM @ 4200 SL 4800 TP 4160
 *
 * produce two (2) `familys`:
 *
 *       SL 1765 ['BUY'] ['GOLD'] TPs [ 1784, 1786, 1789, 1792, 1797 ]
 *       SL 4800 ['SELL_STOP'] ['ETHEREUM'] TPs [ 4160, 4150, 4140, 4100 ]
 *
 * @seealso {@link getFamilyTrades}
 *
 * @todo This functionality might be better served by grouping on the `position`
 * field or even the `customComment` field but unfortunately these fields are
 * unreliable.
 *
 * @returns a 3-member Tuple of Maps keyed on stop loss
 *
 * [ tpMap, typeMap, symbolMap ]
 *
 * Example:
 *
 *     [
 *       Map(2) { 1765 => [ 1784, 1786, 1789, 1792, 1797 ],
 *                4800 => [ 4160, 4150, 4140, 4100 ] },
 *       Map(2) { 1765 => [ 'BUY' ], 4800 => [ 'SELL_STOP' ] },
 *       Map(2) { 1765 => [ 'GOLD' ], 4800 => [ 'ETHEREUM' ] }
 *     ]
 */
export default function (trades: TradeRecords): FamilyMaps {
  const tpMap = new Map()
  const typeMap = new Map()
  const symbolMap = new Map()
  // First loop thru trades to create three (3) Map<number, Array|Set>
  for (const trade of trades) {
    const key = trade.sl
    const tps = tpMap.get(key) || new Array()
    const types = typeMap.get(key) || new Set()
    const symbols = symbolMap.get(key) || new Set()
    tps.push(trade.tp)
    types.add(CMD_FIELD[trade.cmd])
    symbols.add(trade.symbol)
    tpMap.set(key, tps)
    typeMap.set(key, types)
    symbolMap.set(key, symbols)
  }
  // Then spin thru all the maps and replace Set values with Array values
  for (const [key, tpArray] of tpMap) {
    const symbols = [...symbolMap.get(key) as Set<string>]
    const types = [...typeMap.get(key) as Set<string>]
    const tps = tpArray.sort()
    if (types[0].indexOf('SELL') > -1) { // TODO: make sure types.length === 1
      tps.reverse()
    }
    tpMap.set(key, tps)
    typeMap.set(key, types)
    symbolMap.set(key, symbols)
  }
  return [tpMap, typeMap, symbolMap]
}
