import XAPI from 'xapi-node'
import { CMD_FIELD, TYPE_FIELD } from 'xapi-node'

export default async function (xapi: XAPI) {

  console.log('main')

  const transaction = {
    cmd: CMD_FIELD.BUY_LIMIT,
    customComment: null,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    offset: 0,
    order: 0,
    price: 100,
    sl: 0,
    symbol: 'BITCOIN',
    tp: 1000,
    type: TYPE_FIELD.OPEN,
    volume: 10
  }
  const result = await xapi.Socket.send.tradeTransaction(transaction)
  console.log('Result', result)

}
