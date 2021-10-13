import fs from 'fs'
import config from 'config'

import XAPI from 'xapi-node'
import {
  CMD_FIELD,
  TYPE_FIELD,
  ConnectionStatus,
  STREAMING_TRADE_RECORD as streamingTradeRecord,
  STREAMING_TRADE_STATUS_RECORD as streamingTradeStatusRecord,
} from 'xapi-node'

function getTrades (data: streamingTradeRecord) {
  console.log('getTrades', data)
}

function getTradeStatus (data: streamingTradeStatusRecord) {
  console.log('getTradeStatus', data)
}

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

export async function disconnect (xapi: XAPI) {
  process.stdout.write('disconnecting... ')
  await xapi.disconnect()
  process.stdout.write(`${ConnectionStatus[xapi.Socket.status]}\n`)
  process.exit();
}

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

export async function listenForTrades(xapi: XAPI) {
  // xapi.Stream.subscribe.getBalance().catch(console.error)
  xapi.Stream.listen.getTrades(getTrades)
  xapi.Stream.listen.getTradeStatus(getTradeStatus)
  xapi.Stream.subscribe.getTrades().catch(console.error)
  xapi.Stream.subscribe.getTradeStatus().catch(console.error)
}

export async function unListenForTrades(xapi: XAPI) {
  console.log('UNListing')
  // xapi.Stream.unSubscribe.getBalance().catch(console.error)
  // xapi.Stream.subscribe.getTickPrices('EURUSD').catch(() => { console.error('subscribe for EURUSD failed')})
  xapi.Stream.unSubscribe.getTrades().catch(console.error)
  xapi.Stream.unSubscribe.getTradeStatus().catch(console.error)
}
