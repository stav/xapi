import error from './error'
import { kingLogger, debugLogger } from './log'

export default class Robot {

  protected error: Function
  protected log: Function
  protected debugLogger: debugLogger

  constructor() {
    this.error = error
    this.log = kingLogger
    this.debugLogger = new debugLogger()
  }

}
