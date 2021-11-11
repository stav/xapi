import dotenv from 'dotenv'

import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'

import Robot from './robot'

dotenv.config(); // loads .env into process.env

export default class XapiRobot extends Robot {

  protected xapi: XAPI

  constructor() {
    super()
    this.xapi = this.connection()
    this.xapi.logger.onStream('debug', this.log.debug)
  }

  connection(): XAPI {
    const xapi = new XAPI({
      accountId: process.env.ACCOUNTID || '',
      password: process.env.PASSWORD || '',
      host: 'ws.xtb.com', // only for XTB accounts
      type: 'demo',
    })
    xapi.connect()
    xapi.onReady(() => this.main())
    xapi.onReject(console.error)
    return xapi
   }

  main (): void {
    console.info('Socket is:', this.socketStatus())
  }

  private socketStatus(): string {
    return ConnectionStatus[this.xapi.Socket.status]
  }

  async disconnect (): Promise<void> {
    process.stdout.write('disconnecting... ')
    await this.xapi.disconnect()
    process.stdout.write(this.socketStatus())
    process.stdout.write('\n')
    process.exit();
  }

}
