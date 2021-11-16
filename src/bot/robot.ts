import KingLogger from '../log'

/** @name Robot
 **/
export default class Robot {

  protected log: KingLogger

  constructor() {
    this.log = new KingLogger()
  }

  get isTestMode(): Boolean {
    return process.env.NODE_ENV === 'test'
  }

}
