import KingLogger from '../log'
import { getFamilyTrades } from '../trades'

interface TestingApi {
  getFamilyTrades: Function
}

/** @name Robot
 **/
export default class {

  protected log: KingLogger

  testing: TestingApi

  constructor() {
    this.testing = {
      getFamilyTrades,
    }
    this.log = new KingLogger()
  }

  get isTestMode(): Boolean {
    return process.env.NODE_ENV === 'test'
  }

}
