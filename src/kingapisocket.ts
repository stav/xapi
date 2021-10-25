import fs from 'fs'
import config from 'config'

import {
  CMD_FIELD,
  TYPE_FIELD,
} from 'xapi-node'

import XapiRobot from './xapirobot'

function getOrders () {
  const timestamp: number = Date.now()
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
    customComment: 'K1NGbot ' + timestamp,
  }))
}

export default class SocketApiRobot extends XapiRobot {

  constructor() {
    super()
  }

  protected printTrades(trades: any[]) {
    for (let i=0; i<trades.length; i++) {
      const trade = trades[i]
      const type = CMD_FIELD[trade.cmd]
      console.info(
        trades.length > 1 ? `${i+1}.` : '*.',
        'Order', trade.order, trade.order2, trade.position,
        type, trade.symbol,
        '@', trade.open_price,
        'SL', trade.sl,
        'TP', trade.tp,
        trade.profit ? `profit=${trade.profit}` : '\b',
        trade.state ? `(${trade.state})` : '\b',
        trade.customComment ? `"${trade.customComment}"` : '\b',
      )
    }
  }

  async buySellGold() {
    console.info('Buying or selling gold')
    const orders = getOrders()
    console.info(orders.length, 'orders to be created')
    for (const order of orders) {
      try {
        await this.xapi.Socket.send.tradeTransaction(order)
      }
      catch (e: any) {
        this.error(e)
      }
      this.log(order)
    }
  }

  async writeAllSymbols() {
    const result: any = await this.xapi.Socket.send.getAllSymbols()
    // Result [ 'returnData', 'time', 'json', 'transaction' ]
    fs.writeFile('symbols.json', result.json, console.error)
    console.info(`${result.returnData.length} symbols written`)
  }

  async updateTrades() {
    const update: any = config.util.loadFileConfigs().Update
    const entry: number = update.entry
    const trades = this.xapi.positions.filter(trade => trade.open_price === entry)
    console.log('updateTrades', entry)
    this.printTrades(trades)
    delete update.entry
    let count = 0
    for (const trade of trades) {
      const transaction = Object.assign({}, {order: trade.order}, update) // Nah { code: 'BE9', explain: 'Cannot find order' }
      // delete transaction.cmd
      // delete transaction.close_time
      // delete transaction.closed
      // delete transaction.comment
      // delete transaction.commission
      // delete transaction.customComment
      // delete transaction.digits
      // delete transaction.expiration
      // delete transaction.margin_rate
      // delete transaction.offset
      // delete transaction.open_price
      // delete transaction.open_time
      // delete transaction.order2
      // delete transaction.position
      // delete transaction.sl
      // delete transaction.storage
      // delete transaction.symbol
      // delete transaction.tp
      // delete transaction.volume
      console.log('transaction', transaction)
      try {
        await this.xapi.Socket.send.tradeTransaction(transaction)
        // TODO: Need to confirm transaction before incrementing count
        // TODO: Watch for duplicate orders
        count++
      }
      catch (e: any) {
        this.error(e)
      }
    }
    console.log('Updated', count, 'trades with entry', entry, 'to', update)
    const positions: number[] = trades.map(trade => trade.position)
    const result = await this.xapi.Socket.send.getTradeRecords(positions)
    const updatedTrades = JSON.parse(result.json).returnData
    this.printTrades(updatedTrades)
  }

  async getPositions () {
    // Basic info already available in xapi.positions
    const result = await this.xapi.Socket.send.getTrades()
    const trades = JSON.parse(result.json).returnData
    return trades.sort((a: any, b: any) => a.open_time - b.open_time)
  }

  async printPositions () {
    console.info('Printing positions')
    const trades = await this.getPositions()
    this.printTrades(trades)
    for (const trade of trades) {
      this.log(trade)
    }
  }

}
