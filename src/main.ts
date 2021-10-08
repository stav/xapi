import fs from 'fs'
import XAPI from 'xapi-node'
import { CMD_FIELD, TYPE_FIELD } from 'xapi-node'
import config from 'config'

const Orders = function* orderGenerator() {
  const tip: any = config.get('Tip.XAUUSD')
  for (const tp of tip.tp as number[]) {
    yield {
      cmd: tip.type === 'SELL' ? CMD_FIELD.SELL_LIMIT : CMD_FIELD.BUY_LIMIT,
      customComment: null,
      expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
      offset: 0,
      order: 0,
      price: tip.entry,
      sl: tip.sl,
      symbol: 'GOLD',
      tp: tp,
      type: TYPE_FIELD.OPEN,
      volume: 10,
    }
  }
}()

async function buySellGold(xapi: XAPI) {
  for (const order of Array.from(Orders)) {
    await xapi.Socket.send.tradeTransaction(order)
  }
}

async function writeAllSymbols(xapi: XAPI) {
  const result = await xapi.Socket.send.getAllSymbols()
  // Result [ 'returnData', 'time', 'json', 'transaction' ]
  fs.writeFile('symbols.json', result.json, console.error)
  return `${result.returnData.length} symbols written`
}

async function updateStoploss(xapi: XAPI) {
  return await xapi.Socket.send.tradeTransaction({
    order: xapi.positions[0].position,
    type: TYPE_FIELD.MODIFY,
    sl: 1754,
  })
}

export default async function (xapi: XAPI) {

  console.log('main')
  // const result = await buySellGold(xapi)
  // const result = await writeAllSymbols(xapi)
  // const result = await updateStoploss(xapi)
  // console.log('Result', result)

}
