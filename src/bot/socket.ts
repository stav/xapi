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

/** @name SocketApiRobot
 **/
export default class SocketApiRobot extends XapiRobot {

  protected buySellTip: Function
  protected printTrades: Function
  protected buySellPrice: Function
  protected getAllTrades: Function
  protected updateTrades: Function
  protected printAllTrades: Function
  protected getFamilyTrades: Function
  protected writeAllSymbols: Function

  constructor() {
    super()

    this.buySellTip = buySellTip
    this.buySellPrice = buySellPrice
    this.getAllTrades = getAllTrades
    this.updateTrades = updateTrades
    this.printAllTrades = printAllTrades
    this.getFamilyTrades = getFamilyTrades
    this.writeAllSymbols = writeAllSymbols

    this.printTrades = printTrades
    this.printTrades = this.printTrades.bind(this)

    this.testing.getFamilyTrades = getFamilyTrades
    this.testing.getAllTrades = getAllTrades
  }

}
