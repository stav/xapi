import XapiRobot from './xapirobot'
import { writeAllSymbols } from './symbols'
import { buySellTip, buySellPrice } from './orders'
import {
  getFamilyTrades,
  printAllTrades,
  getAllTrades,
  updateTrades,
  printTrades,
} from './trades'

export default class SocketApiRobot extends XapiRobot {

  protected buySellPrice: Function
  protected buySellTip: Function
  protected getAllTrades: Function
  protected getFamilyTrades: Function
  protected printAllTrades: Function
  protected printTrades: Function
  protected updateTrades: Function
  protected writeAllSymbols: Function

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
  }

}
