import dotenv from 'dotenv'

import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

import Robot from './robot'

dotenv.config() // loads .env into process.env

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

  private printStatus(status?: string | number) {
    if (this.isTestMode) {
      return
    }
    if (status === undefined) {
      status = this.xapi.Socket.status
    }
    if (typeof status === 'number') {
      status = ConnectionStatus[status]
    }
    console.info('Socket is:', status)
  }

  get isConnected(): Boolean {
    return this.xapi.Socket.status === ConnectionStatus.CONNECTED
  }

  connect (readyCallback: ()=>void = ()=>{}): void {
    if (this.isConnected) {
      this.printStatus()
      return
    }
    if (!this.isTestMode) {
      console.info('Connecting socket')
    }
    this.xapi.connect().catch(console.error)
    this.xapi.onReject(console.error)
    this.xapi.onConnectionChange(this.printStatus.bind(this))
    this.xapi.onReady(readyCallback)
  }

  async disconnect (): Promise<void> {
    !this.isTestMode && console.log('Exit')
    if (this.isConnected) {
      process.stdout.write('disconnecting... ')
      await this.xapi.disconnect()
    }
    process.stdin.pause()
  }

}
