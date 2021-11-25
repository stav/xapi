import {
  writeAllSymbols,
} from '../lib/symbols'
import {
  createOrders,
  createOrdersFromTip,
  createOrdersFromTelegram,
  createOrdersHedge,
} from '../orders'
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

  protected printTrades: Function
  protected createOrders: Function
  protected getAllTrades: Function
  protected updateTrades: Function
  protected printAllTrades: Function
  protected getFamilyTrades: Function
  protected writeAllSymbols: Function
  protected createOrdersHedge: Function
  protected createOrdersFromTip: Function

  createOrdersFromTelegram: Function

  constructor() {
    super()

    this.createOrders = createOrders
    this.getAllTrades = getAllTrades
    this.updateTrades = updateTrades
    this.printAllTrades = printAllTrades
    this.getFamilyTrades = getFamilyTrades
    this.writeAllSymbols = writeAllSymbols
    this.createOrdersHedge = createOrdersHedge
    this.createOrdersFromTip = createOrdersFromTip
    this.createOrdersFromTelegram = createOrdersFromTelegram

    this.printTrades = printTrades
    this.printTrades = this.printTrades.bind(this)

    this.testing.getFamilyTrades = getFamilyTrades
    this.testing.getAllTrades = getAllTrades
  }

}
