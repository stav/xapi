import config from 'config'

import {
  CMD_FIELD,
  TYPE_FIELD,
  TICK_RECORD,
  TRADE_TRANS_INFO,
 } from 'xapi-node'

interface Asset {
  symbol: string
  volume: number
  digits: number
  modify: number
}

export default async function (getTickPrices: Function, error: Function): Promise<TRADE_TRANS_INFO[]> {
  const assets: Asset[] = config.util.loadFileConfigs().Test.Assets || []

  const result = await getTickPrices(assets.map(a => a.symbol)).catch(error)
  if (!result) {
    return []
  }
  const records: TICK_RECORD[] = result.returnData.quotations
  const levelZeroRecords = records.filter(r => r.level === 0)
  console.info('TICKS records', levelZeroRecords)
  const timestamp: number = Date.now()
  const orders = []
  const order = {
    type: TYPE_FIELD.OPEN,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    customComment: 'K1NGbot ' + timestamp,
    offset: 0,
    order: 0,
  }
  const tpRates = [ 0.005, 0.007, 0.009 ]

  for (const record of levelZeroRecords) {
    const asset = assets.find(a => a.symbol === record.symbol)
    const mod = asset?.modify || 1
    const volume = asset?.volume || 1
    const bid = record.bid
    const buyPrice = parseFloat((bid + bid * 0.002 * mod).toFixed(asset?.digits))
    const sellPrice = parseFloat((bid - bid * 0.001 * mod).toFixed(asset?.digits))
    let tpLevel: number = 0
    console.log('TICK spread', record.symbol, buyPrice - sellPrice)
    for (const rate of tpRates) {
      tpLevel++
      orders.push(Object.assign({}, order, {
        cmd: CMD_FIELD.BUY_STOP,
        symbol: record.symbol,
        price: buyPrice,
        tp: parseFloat((buyPrice + buyPrice * rate * mod).toFixed(2)),
        sl: parseFloat((bid * 0.96).toFixed(2)),
        customComment: order.customComment + ' TP' + tpLevel,
        volume,
      }))
      orders.push(Object.assign({}, order, {
        cmd: CMD_FIELD.SELL_STOP,
        symbol: record.symbol,
        price: sellPrice,
        tp: parseFloat((sellPrice - sellPrice * rate * mod).toFixed(asset?.digits)),
        sl: parseFloat((bid * 1.04).toFixed(asset?.digits)),
        customComment: order.customComment + ' TP' + tpLevel,
        volume,
      }))
    }
  }
  return orders
}
