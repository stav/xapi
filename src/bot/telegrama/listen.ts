import { NewMessage } from 'telegram/events'
import config from 'config'

import Logger from '../../log'
import KingBot from '../king'

const chats = config.get('Telegram.Chats') as number[]
const pmap = config.get('Telegram.ChatParserMap') as any

async function printMessage(event: any): Promise<void> {
  Logger.info()
  const msg = event.message
  const message = msg.message.replace(/\s+/g, ' ')
  const sender = await msg.getSender()
  const date = new Date(msg.date * 1000)
  Logger.info(event.chatId, date, sender.username, '-', sender.title, '|', message)
}

async function handler(kingbot: KingBot, event: any) {
  if ('message' in event) {
    await printMessage(event)
    console.log('parser map:', event.chatId in pmap, pmap)
    if (event.chatId in pmap) {
      const modulex: string = pmap[event.chatId]
      console.log('module:', modulex)
      const parser = await import(`./parsers/${modulex}`)
      console.log('parser:', parser)
      let signal
      try {
        signal = parser.default(event.message.message)
      } catch (e) {
        Logger.error(e)
      }
      console.log('signal:', signal)
      if (signal?.tps?.length) {
        kingbot.createOrdersFromTelegram(signal)
      }
    }
  }
  else {
    console.error(event) // TODO: debug
    Logger.error(event)
  }
}

export default async function (kingbot: KingBot, client: any) {

  kingbot.telegramChatParserMap = pmap
  kingbot.telegramChats = chats

  const me = await client.getMe()
  const username = me.username ? `(${me.username})` : ''
  // const user = await client.getEntity(algo)
  Logger.info('Logged in as', me.id, me.firstName, username, client.session.save())

  client.addEventHandler((event: any) => handler(kingbot, event), new NewMessage({ chats }))
  Logger.info('Listening', chats.length, chats, pmap)

}
