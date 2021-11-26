import { TelegramClient } from 'telegram'
import KingBot from '../king'
import Robot from '../robot'
import Client from './client'

/**
 */
export default class TelegramApiRobot extends Robot {

  protected telegramClient: TelegramClient | null = null

  telegramChatParserMap: any = {}
  telegramChats: number[] = []

  constructor() {
    super()
  }

  async connect_telegram (this: KingBot): Promise<void> {
    this.log.info('Connecting Telegram')
    this.telegramClient = await Client(this)
  }

  disconnect (): void {
    // TODO
    // "\u0004" Exit
    // [2021-12-06T01:11:48.689Z] [ERROR] - [Error: Cannot send requests while disconnected. You need to call .connect()]
    super.disconnect()
    this.telegramClient && this.telegramClient.disconnect()
  }

}
