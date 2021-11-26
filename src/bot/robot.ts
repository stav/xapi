import child from 'child_process'
import Logger from '../log'

/**
 */
export default class Robot {

  private _revision: string

  protected log = new Logger()

  testing: any = {}

  constructor() {
    const gitCommand = 'git rev-parse --short HEAD'
    this._revision = child.execSync(gitCommand).toString().trim()
  }

  get isTestMode(): Boolean {
    return process.env.NODE_ENV === 'test'
  }

  disconnect (): void {
    this.log.info('Exit')
  }

  printStatus (): void {
    this.log.info('Print status')
    this.log.info('Repository revision', this._revision)
  }

}
