import KingLogger from '../log'

export default class Robot {

  protected log: KingLogger

  constructor() {
    this.log = new KingLogger()
  }

}
