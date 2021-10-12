import fs from 'fs'
import config from 'config'

import XAPI from 'xapi-node'
import { CMD_FIELD, TYPE_FIELD } from 'xapi-node'

const orders = function () {
  const tip: any = config.get('Tip.XAUUSD')
  return tip.tp.map((tp: any) => ({
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
  }))
}()

export async function buySellGold(xapi: XAPI) {
  for (const order of orders) {
    await xapi.Socket.send.tradeTransaction(order)
  }
}

export async function writeAllSymbols(xapi: XAPI) {
  const result = await xapi.Socket.send.getAllSymbols()
  // Result [ 'returnData', 'time', 'json', 'transaction' ]
  fs.writeFile('symbols.json', result.json, console.error)
  console.log(`${result.returnData.length} symbols written`)
}

export async function updateStoploss(xapi: XAPI) {
  await xapi.Socket.send.tradeTransaction({
    order: xapi.positions[0].position,
    type: TYPE_FIELD.MODIFY,
    sl: 1754,
  })
}
