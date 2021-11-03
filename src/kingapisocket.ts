import config from 'config'

import {
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import getOrders from './orders'
import XapiRobot from './xapirobot'
import { printTrades } from './trades'
import { writeAllSymbols } from './symbols'

interface EntryInfo {
  entry: number
}
type UpdateTransactionInfo = TRADE_TRANS_INFO & EntryInfo

export default class SocketApiRobot extends XapiRobot {

  protected printTrades: Function
  protected writeAllSymbols: Function

  constructor() {
    super()
    this.printTrades = printTrades
    this.writeAllSymbols = () => writeAllSymbols(this.xapi)
  }

  protected async buySellGold(): Promise<void> {
    console.info('Buying or selling gold')
    const orders: TRADE_TRANS_INFO[] = getOrders()
    console.info(orders.length, 'orders to be created')
    for (const order of orders) {
      console.info(order)
      await this.xapi.Socket.send.tradeTransaction(order).catch(console.warn)
      this.log(order)
    }
  }

  protected async updateTrades(): Promise<void> {
    const update: UpdateTransactionInfo = config.util.loadFileConfigs().Update
    const entry: number = update.entry
    const trades = this.xapi.positions.filter(trade => trade.open_price === entry) // TODO: could be stop loss or getFamilyTrades or something
    console.log('Update trades with open price of', entry)
    this.printTrades(trades)
    let count = 0
    for (const trade of trades) {
      const { entry, ...transaction } = Object.assign({}, {order: trade.order}, update)
      console.log('transaction', transaction)
      await this.xapi.Socket.send.tradeTransaction(transaction).catch(console.warn)
      // TODO: Need to confirm transaction before incrementing count
      // TODO: Watch for duplicate orders
      count++
    }
    console.log('Updated', count, 'trades with entry', entry, 'to', update)
    const positions: number[] = trades.map(trade => trade.position)
    const result = await this.xapi.Socket.send.getTradeRecords(positions).catch(console.warn)
    if (result) {
      const updatedTrades = JSON.parse(result.json).returnData
      this.printTrades(updatedTrades)
    }
  }

  protected async getFamilyTrades(data: STREAMING_TRADE_RECORD): Promise<TRADE_RECORD[]> {
    let trades: TRADE_RECORD[] = await this.getAllTrades()
    trades = trades.filter((trade: TRADE_RECORD) => trade.sl === data.sl)
    console.log('Family trades', trades.length)
    this.printTrades(trades)
    return trades
  }

  private async getAllTrades (): Promise<TRADE_RECORD[]> {
    // Basic info already available in xapi.positions
    const result = await this.xapi.Socket.send.getTrades().catch(console.warn)
    if (!result) {
      return []
    }
    const trades: TRADE_RECORD[] = JSON.parse(result.json).returnData
    return trades.sort((a: TRADE_RECORD, b: TRADE_RECORD) => a.open_time - b.open_time)
  }

  protected async printAllTrades (): Promise<void> {
    console.info('Printing all positions')
    const trades: TRADE_RECORD[] = await this.getAllTrades()
    this.printTrades(trades)
  }

}
