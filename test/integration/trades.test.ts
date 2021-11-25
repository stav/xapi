import { TRADE_RECORD } from 'xapi-node'

import K1NG from '../../src/bot'

jest.setTimeout(7 * 1000)

const trade = {
  order: -1,
  sl: -1,
}

describe("Trades", () => {

  let king: K1NG

  beforeAll(() => {
    king = new K1NG()
  })

  afterAll(async () => {
    await king.disconnect()
  })

  test("Check get all trades empty", async () => {
    const getAllTrades = king.testing.getAllTrades.bind(king)
    const trades: TRADE_RECORD[] = await getAllTrades()
    expect(trades).toHaveLength(0) // not connected
  })

  test("Check family trades", done => {
    async function callback() {
      try {
        const getFamilyTrades = king.testing.getFamilyTrades.bind(king)
        const familys: TRADE_RECORD[] = await getFamilyTrades(trade)
        expect(familys).toHaveLength(0) // no orders with order# -1
        done()
      } catch (error) {
        done(error)
      }
    }
    king.connect_xapi(async () => await callback())
  })

})
