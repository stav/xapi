import error from './error'
import log from './log'

export default class Robot {

  protected error: Function
  protected log: Function

  constructor() {
    this.error = error
    this.log = log
  }

}
