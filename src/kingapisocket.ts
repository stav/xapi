import {
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import XapiRobot from './xapirobot'
import { printTrades } from './trades'
import { updateTrades } from './updates'
import { writeAllSymbols } from './symbols'
import { buySellTip, buySellPrice } from './orders'

export default class SocketApiRobot extends XapiRobot {

  protected buySellTip: Function
  protected buySellPrice: Function
  protected printTrades: Function
  protected updateTrades: Function
  protected writeAllSymbols: Function

  constructor() {
    super()
    this.buySellTip = buySellTip
    this.buySellPrice = buySellPrice
    this.printTrades = printTrades
    this.updateTrades = updateTrades
    this.writeAllSymbols = writeAllSymbols
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
    const result = await this.xapi.Socket.send.getTrades().catch(this.console.error)
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
