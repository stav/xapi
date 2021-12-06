import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'
import config from 'config'

import TelegramApiRobot from './telegrama'

/**
 */
export default class XapiRobot extends TelegramApiRobot {

  private defaultConfig = {
    accountId: config.get('Xapi.accountId') as string,
    password: config.get('Xapi.password') as string,
    type: config.get('Xapi.type') as string,
    host: 'ws.xtb.com', // only for XTB accounts
    appName: 'K1NGbot',
  }

  protected xapi: XAPI
  protected timestamp: number

  constructor() {
    super()
    this.timestamp = 0
    this.xapi = new XAPI(this.defaultConfig)
    this.xapi.logger.onStream('debug', this.log.debug)
  }

  main (): void {
    this.printConnectionStatus()
  }

  private printConnectionStatus(status?: string | number) {
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

  async getVersion(): Promise<string> {
    const result = await this.xapi.Socket.send.getVersion().catch(this.log.error)
    return `${result?.returnData?.version}`
  }

  async printStatus (): Promise<void> {
    super.printStatus()
    this.printConnectionStatus()
    const date = new Date()
    this.log.info({
      Account: this.xapi['account'],
      WebSocket: this.xapi.Socket['WebSocket']['url'],
      Session: this.xapi.Stream.session,
      Message: this.xapi.Socket.lastReceivedMessage,
      XapiVersion: await this.getVersion(),
      KeepAlive: this.timestamp ? new Date(this.timestamp) : undefined,
      UTC_String: date.toUTCString(),
      UTC_Date: date,
      Local: date.toLocaleString(),
      TelegramChatParserMap: this.telegramChatParserMap,
      TelegramChats: this.telegramChats.map(c => [c, c in this.telegramChatParserMap]),
      // TODO: show Xapi: listeners
      // TODO: show Telegram: getMe
    })
  }

  connect_xapi (readyCallback: ()=>void = ()=>{}): void {
    if (this.isConnected) {
      this.printConnectionStatus()
      return
    }
    this.log.info('Connecting socket')
    this.xapi.connect().catch(console.error)
    this.xapi.onReject(console.error)
    this.xapi.onConnectionChange(this.printConnectionStatus.bind(this))
    this.xapi.onReady(readyCallback)
  }

  async disconnect (): Promise<void> {
    super.disconnect()
    if (!this.isTestMode) {
      process.stdin.pause()
      this.isConnected && process.stdout.write('disconnecting... ')
    }
    if (this.isConnected) {
      await this.xapi.Stream.unSubscribe.getKeepAlive().catch(console.error)
      await this.xapi.disconnect()
    }
  }

}
