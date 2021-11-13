import { TRADE_RECORD } from 'xapi-node'

import getFamilyMaps from "../../src/trades/getFamilyMaps"

type NumberMap = Map<number, Array<number>>
type StringMap = Map<number, Array<string>>

const keys = [3.14, 1800, 1899]
const trades = [
  <TRADE_RECORD>{ symbol: 'PIES', sl: 3.14, tp: 2.90, cmd: 3 },
  <TRADE_RECORD>{ symbol: 'PIES', sl: 3.14, tp: 2.80, cmd: 3 },
  <TRADE_RECORD>{ symbol: 'PIES', sl: 3.14, tp: 2.70, cmd: 3 },
  <TRADE_RECORD>{ symbol: 'GOLD', sl: 1800, tp: 1810, cmd: 0 },
  <TRADE_RECORD>{ symbol: 'GOLD', sl: 1800, tp: 1820, cmd: 0 },
  <TRADE_RECORD>{ symbol: 'GOLD', sl: 1899, tp: 1830, cmd: 0 },
]

// tpsMap Map(3) { 3.14 => [ 2.9, 2.8, 2.7 ], 1800 => [ 1810, 1820 ], 1899 => [ 1830 ] }
// typMap Map(3) { 3.14 => ['SELL_LIMIT'   ], 1800 => ['BUY'       ], 1899 => ['BUY' ] }
// symMap Map(3) { 3.14 => ['PIES'         ], 1800 => ['GOLD'      ], 1899 => ['GOLD'] }

describe("Maps", () => {

  let tpsMap: NumberMap
  let typMap: StringMap
  let symMap: StringMap

  beforeAll(() => {
    [ tpsMap, typMap, symMap ] = getFamilyMaps(trades)
  })

  test("Check family maps shape", () => {
    expect(tpsMap).toBeDefined()
    expect(typMap).toBeDefined()
    expect(symMap).toBeDefined()
    expect(tpsMap).toBeInstanceOf(Map)
    expect(typMap).toBeInstanceOf(Map)
    expect(symMap).toBeInstanceOf(Map)
    expect(tpsMap.size).toBe(3)
    expect(typMap.size).toBe(3)
    expect(symMap.size).toBe(3)
  })

  test("Check family maps keys", () => {
    const tpsKeys = [...tpsMap.keys()]
    const typKeys = [...typMap.keys()]
    const symKeys = [...symMap.keys()]
    expect(tpsKeys).toHaveLength(3)
    expect(typKeys).toHaveLength(3)
    expect(symKeys).toHaveLength(3)
    expect(tpsKeys).toEqual(expect.arrayContaining(keys))
    expect(typKeys).toEqual(expect.arrayContaining(keys))
    expect(symKeys).toEqual(expect.arrayContaining(keys))
  })

  test("Check family maps tps", () => {
    expect(tpsMap.get(3.14)).toStrictEqual<Array<number>>([2.9, 2.8, 2.7])
    expect(tpsMap.get(1800)).toStrictEqual<Array<number>>([1810, 1820])
    expect(tpsMap.get(1899)).toStrictEqual<Array<number>>([1830])
  })

  test("Check family maps type", () => {
    expect(typMap.get(3.14)).toStrictEqual<Array<string>>(['SELL_LIMIT'])
    expect(typMap.get(1800)).toStrictEqual<Array<string>>(['BUY'])
    expect(typMap.get(1899)).toStrictEqual<Array<string>>(['BUY'])
  })

  test("Check family maps symbol", () => {
    expect(symMap.get(3.14)).toStrictEqual<Array<string>>(['PIES'])
    expect(symMap.get(1800)).toStrictEqual<Array<string>>(['GOLD'])
    expect(symMap.get(1899)).toStrictEqual<Array<string>>(['GOLD'])
  })

})
