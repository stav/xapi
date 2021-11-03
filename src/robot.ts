import Console from './console'
import { kingLogger, debugLogger } from './log'

export default class Robot {

  protected log: Function
  protected console: Console
  protected debugLogger: debugLogger

  constructor() {
    this.log = kingLogger
    this.console = new Console()
    this.debugLogger = new debugLogger()
  }

}
