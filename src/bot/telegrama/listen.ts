import { NewMessage } from 'telegram/events'
import dotenv from 'dotenv'

import Logger from '../../log'

import KingBot from '../king'

import chats from './chats'

dotenv.config() // loads .env into process.env

const re = /XAUUSD (?<type>BUY|SELL)\s+ENTRADA: (?<entry>[\d.]+)\s+SL: (?<sl>[\d.]+)\s+(?<tps>.+)/s

/** @name parseMessageForSignal
 **
 ** Takes a string and parses out information to create an order on XTB.
 **
 ** @param text XAUUSD SELL ENTRADA: 1796 SL: 1806 TP1: 1794 TP2: 1792 TP3: 1789
 **
 ** Note: The format as described in the `text` param is required exactly.
 **
 ** @returns {
 **    type: 'SELL',
 **    entry: '1796',
 **    sl: '1806',
 **    tps: [ 1794, 1792, 1789 ]
 **  }
 **/
function parseMessageForSignal(text: string): any {
  const message = text || ''
  const m: any = message.match(re)?.groups || ''
  const symbol = 'GOLD'
  const volume = 1

  function tpLabelMap(tpLabel: string) {
    const tpMatch = tpLabel.trim().match(/[\d.]+$/) || [0]
    return +tpMatch[0]
  }

  const tps = m.tps.split('\n').map(tpLabelMap).filter(Boolean)
  const signal = Object.assign( { symbol, volume }, m, { tps } )
  return signal
}

async function handler(kingbot: KingBot, event: any) {
  Logger.info()
  if ('message' in event) {
    const m = event.message
    const message = m.message.replace(/\s+/g, ' ')
    const sender = await m.getSender()
    const name = sender.username || sender.title
    const date = new Date(m.date * 1000)
    const targetChatId = +(process.env.CHAT || 0)
    Logger.info(event.chatId, date, name, '|', message)
    if (event.chatId === targetChatId) {
      let signal
      try {
        signal = parseMessageForSignal(m.message)
      } catch (e) { }
      if (signal?.tps?.length) {
        kingbot.createOrdersFromTelegram(signal)
      }
    }
  }
  else {
    Logger.error(event)
  }
}

export default async function (kingbot: KingBot, client: any) {

  const me = await client.getMe()
  const username = me.username ? `(${me.username})` : ''
  // const user = await client.getEntity(algo)
  Logger.info('Logged in as', me.id, me.firstName, username, client.session.save())

  client.addEventHandler((event: any) => handler(kingbot, event), new NewMessage({ chats }))
  Logger.info('Listening', chats.length, chats)

}
