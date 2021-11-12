import KingLogger from '../log'
import {
  getAllTrades,
  getFamilyTrades,
 } from '../trades'

interface TestingApi {
  getFamilyTrades: Function
  getAllTrades: Function
}

/** @name Robot
 **/
export default class {

  protected log: KingLogger

  testing: TestingApi

  constructor() {
    this.testing = {
      getFamilyTrades,
      getAllTrades,
    }
    this.log = new KingLogger()
  }

  get isTestMode(): Boolean {
    return process.env.NODE_ENV === 'test'
  }

}
