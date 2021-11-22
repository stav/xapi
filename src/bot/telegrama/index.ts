import { TelegramClient } from 'telegram'
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

  async connect_telegram (): Promise<void> {
    this.telegramClient = await Client()
  }

  disconnect (): void {
    super.disconnect()
    this.telegramClient && this.telegramClient.disconnect();
  }

}
