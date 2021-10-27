import config from 'config'

import getOrders from './orders'
import XapiRobot from './xapirobot'
import { printTrades } from './trades'
import { writeAllSymbols } from './symbols'

export default class SocketApiRobot extends XapiRobot {

  protected printTrades: Function
  protected writeAllSymbols: Function

  constructor() {
    super()
    this.printTrades = printTrades
    this.writeAllSymbols = () => writeAllSymbols(this.xapi)
  }

  async buySellGold() {
    console.info('Buying or selling gold')
    const orders = getOrders()
    console.info(orders.length, 'orders to be created')
    for (const order of orders) {
      console.info(order)
      try {
        await this.xapi.Socket.send.tradeTransaction(order)
      }
      catch (e: any) {
        this.error(e)
      }
      this.log(order)
    }
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
