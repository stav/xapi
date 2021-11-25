import KingLogger from '../log'

/** @name Robot
 **/
export default class Robot {

  protected log: KingLogger

  testing: any

  constructor() {
    this.log = new KingLogger()
    this.testing = {}
  }

  get isTestMode(): Boolean {
    return process.env.NODE_ENV === 'test'
  }

  disconnect (): void {
    if (!this.isTestMode) {
      console.log('Exit')
    }
  }

}
