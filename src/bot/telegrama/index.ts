import { TelegramClient } from 'telegram'
import KingBot from '../king'
import Robot from '../robot'
import Client from './client'

/** @name TelegramApiRobot
 **/
export default class TelegramApiRobot extends Robot {

  protected telegramClient: TelegramClient | null

  constructor() {
    super()
    this.telegramClient = null
  }

  async connect_telegram (this: KingBot): Promise<void> {
    this.telegramClient = await Client(this)
  }

  disconnect (): void {
    super.disconnect()
    this.telegramClient && this.telegramClient.disconnect();
  }

}
