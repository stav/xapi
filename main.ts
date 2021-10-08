import fs from 'fs'
import XAPI from 'xapi-node'
import { CMD_FIELD, TYPE_FIELD } from 'xapi-node'

async function buyGold(xapi: XAPI) {
  return await xapi.Socket.send.tradeTransaction({
    cmd: CMD_FIELD.BUY_LIMIT,
    customComment: null,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    offset: 0,
    order: 0,
    price: 1752,
    sl: 1750,
    symbol: 'GOLD',
    tp: 1756,
    type: TYPE_FIELD.OPEN,
    volume: 10,
  })
}

async function writeAllSymbols(xapi: XAPI) {
  const result = await xapi.Socket.send.getAllSymbols()
  // Result [ 'returnData', 'time', 'json', 'transaction' ]
  fs.writeFile('symbols.json', result.json, console.error)
  return `${result.returnData.length} symbols written`
}

export default async function (xapi: XAPI) {

  console.log('main')
  // const result = await buyGold(xapi)
  const result = await writeAllSymbols(xapi)
  console.log('Result', result)

}
