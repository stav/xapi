import {
  CMD_FIELD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import { checkProfits } from '../../src/lib/profits'
import { getFamilyTrades } from '../../src/trades'

jest.mock('../../src/trades/get')

let mockTradeTransaction = jest.fn();

async function tradeTransaction (transaction: TRADE_TRANS_INFO) {
  mockTradeTransaction(transaction)
}

class KingBotMock {

  log: any
  xapi: any
  checkProfits: Function
  getFamilyTrades: Function

  constructor() {
    this.checkProfits = checkProfits
    this.getFamilyTrades = getFamilyTrades
    this.xapi = { Socket: { send: { tradeTransaction }}}
    this.log = { info: ()=>{} }
  }

  protected printTrades (trades: any[]) { }
  protected printAllTrades (trades: any[]) { }

  async tradeEvent (data: STREAMING_TRADE_RECORD): Promise<void> {
    await this.checkProfits(data)
  }

}

const event: Partial<STREAMING_TRADE_RECORD> = {
  close_price: 200,
  open_price: 100,
  comment: '[T/P]',
  closed: true,
  digits: 2,
  cmd: CMD_FIELD.BUY,
  sl: 10,
}

describe("Stream", () => {

  test("default", async () => {
    const bot = new KingBotMock()
    const result = await bot.tradeEvent(<STREAMING_TRADE_RECORD>event).catch(console.error)
    expect(result).toBeUndefined()
    expect(mockTradeTransaction.mock.calls.length).toBe(1)
    expect(mockTradeTransaction).toBeCalledWith(
      expect.objectContaining({
        sl: 100.03,
        order: expect.any(Number),
        type: 3,
      }),
    )
  })

})
