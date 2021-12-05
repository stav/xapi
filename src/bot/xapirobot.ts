import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'
import config from 'config'

import TelegramApiRobot from './telegrama'

/**
 */
export default class XapiRobot extends TelegramApiRobot {

  protected xapi: XAPI
  protected timestamp: number

  private defaultConfig = {
    accountId: config.get('Telegram.accountId') as string,
    password: config.get('Telegram.password') as string,
    host: 'ws.xtb.com', // only for XTB accounts
    type: 'demo',
    appName: 'K1NGbot',
  }

  constructor() {
    super()
    this.timestamp = 0
    this.xapi = new XAPI(this.defaultConfig)
    this.xapi.logger.onStream('debug', this.log.debug)
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
    this.log.info('Socket is:', status)
  }

  get isConnected(): Boolean {
    return this.xapi.Socket.status === ConnectionStatus.CONNECTED
  }

  connect_xapi (readyCallback: ()=>void = ()=>{}): void {
    if (this.isConnected) {
      this.printStatus()
      return
    }
    this.log.info('Connecting socket')
    this.xapi.connect().catch(console.error)
    this.xapi.onReject(console.error)
    this.xapi.onConnectionChange(this.printStatus.bind(this))
    this.xapi.onReady(readyCallback)
  }

  async disconnect (): Promise<void> {
    super.disconnect()
    if (!this.isTestMode) {
      process.stdin.pause()
      this.isConnected && process.stdout.write('disconnecting... ')
    }
    if (this.isConnected) {
      await this.xapi.disconnect()
    }
  }

}
