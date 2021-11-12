import dotenv from 'dotenv'

import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

import Robot from './robot'

dotenv.config(); // loads .env into process.env

/** @name XapiRobot
 **/
export default class extends Robot {

  protected xapi: XAPI

  private defaultConfig = {
    accountId: process.env.ACCOUNTID || '',
    password: process.env.PASSWORD || '',
    host: 'ws.xtb.com', // only for XTB accounts
    type: 'demo',
  }

  constructor() {
    super()
    this.xapi = new XAPI(this.defaultConfig)
    this.xapi.logger.onStream('debug', this.log.debug)
    this.main()
  }

  main (): void {
    this.printStatus()
  }

  private socketStatus(): string {
    return ConnectionStatus[this.xapi.Socket.status]
  }

  private printStatus() {
    console.info('Socket is:', this.socketStatus())
  }

  connect (): void {
    console.info('Connecting socket')
    this.xapi.connect()
    this.xapi.onReject(console.error)
    this.xapi.onConnectionChange(this.printStatus.bind(this))
    // this.xapi.onReady(() => {})
  }

  async disconnect (): Promise<void> {
    process.stdout.write('disconnecting... ')
    await this.xapi.disconnect()
    process.stdout.write(this.socketStatus())
    process.stdout.write('\n')
    process.exit();
  }

}
