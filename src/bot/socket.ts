import { writeAllSymbols } from '../lib/symbols'
import { buySellTip, buySellPrice } from '../orders'
import {
  getFamilyTrades,
  printAllTrades,
  getAllTrades,
  updateTrades,
  printTrades,
} from '../trades'
import XapiRobot from './xapirobot'

interface TestingApi {
  getFamilyTrades: Function
  getAllTrades: Function
}

/** @name SocketApiRobot
 **/
export default class extends XapiRobot {

  protected buySellPrice: Function
  protected buySellTip: Function
  protected getAllTrades: Function
  protected getFamilyTrades: Function
  protected printAllTrades: Function
  protected printTrades: Function
  protected updateTrades: Function
  protected writeAllSymbols: Function

  testing: TestingApi

  constructor() {
    super()

    this.buySellPrice = buySellPrice
    this.buySellTip = buySellTip
    this.getAllTrades = getAllTrades
    this.getFamilyTrades = getFamilyTrades
    this.printAllTrades = printAllTrades
    this.printTrades = printTrades
    this.updateTrades = updateTrades
    this.writeAllSymbols = writeAllSymbols

    this.testing = {
      getFamilyTrades,
      getAllTrades,
    }
  }

}
