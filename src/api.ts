import fs from 'fs'
import config from 'config'

import XAPI from 'xapi-node'
import {
  CMD_FIELD,
  TYPE_FIELD,
  STREAMING_TRADE_RECORD as streamingTradeRecord,
  STREAMING_TRADE_STATUS_RECORD as streamingTradeStatusRecord,
} from 'xapi-node'

import { socketStatus } from './utils'

function tradeEvent (data: streamingTradeRecord) {
  console.log(JSON.stringify(data))
}

function getOrders () {
  const tip: any = config.util.loadFileConfigs().Tip
  return tip.tp.map((tp: any) => ({
    order: 0,
    offset: 0,
    symbol: tip.symbol,
    cmd: tip.type === 'SELL' ? CMD_FIELD.SELL_STOP : CMD_FIELD.BUY_STOP,
    price: tip.entry,
    sl: tip.sl,
    tp: tp,
    type: TYPE_FIELD.OPEN,
    volume: tip.volume,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    customComment: 'K1NGbot',
  }))
}

export async function buySellGold(xapi: XAPI) {
  console.log('Buying or selling gold')
  const orders = getOrders()
  console.log(orders.length, 'orders to be created')
  console.log(orders)
  for (const order of orders) {
    try {
      await xapi.Socket.send.tradeTransaction(order)
    }
    catch (e: any) {
      console.error(`Nope, order ${e.order} ${e.message}`)
    }
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

export async function listenForTrades(xapi: XAPI) {
  console.log('Listening for trades')
  // xapi.Stream.subscribe.getBalance().catch(console.error)
  xapi.Stream.listen.getTrades(tradeEvent)
  xapi.Stream.subscribe.getTrades().catch(console.error)
}

export async function unListenForTrades(xapi: XAPI) {
  console.log('No longer listening for trades')
  // xapi.Stream.unSubscribe.getBalance().catch(console.error)
  // xapi.Stream.subscribe.getTickPrices('EURUSD').catch(() => { console.error('subscribe for EURUSD failed')})
  xapi.Stream.unSubscribe.getTrades().catch(console.error)
}

export async function disconnect (xapi: XAPI) {
  process.stdout.write('disconnecting... ')
  await xapi.disconnect()
  process.stdout.write(socketStatus(xapi))
  process.stdout.write('\n')
  process.exit();
}
