import { NewMessage } from 'telegram/events'
import dotenv from 'dotenv'
import chats from './chats'

dotenv.config(); // loads .env into process.env

const re = /XAUUSD (?<type>BUY|SELL)\s+ENTRADA: (?<price>[\d.]+)\s+SL: (?<sl>[\d.]+)\s+(?<tps>.+)/s

function parseMessage(text: string) {
  const message = text || ''
  const m: any = message.match(re)?.groups || '';
  try {
    const tps = m.tps.split('\n').map((tp: string) => +(tp.trim().match(/[\d.]+$/) || [0])[0]); // TODO uh yeah
    console.log(m.type, 'GOLD', '@', m.price, 'unless', m.sl, 'tps', tps);
  }
  catch (e) { }
}

async function handler(event: any) {
  console.log();
  if ('message' in event) {
    const m = event.message;
    const message = m.message.replace(/\s+/g, ' ');
    const sender = await m.getSender();
    const name = sender.username || sender.title;
    const date = new Date(m.date * 1000);
    const targetChatId = +(process.env.CHAT || 0)
    console.log(event.chatId, process.env.CHAT, date, name, '|', message);
    if (event.chatId === targetChatId) {
      parseMessage(m.message)
    }
  }
  else {
    console.warn(event)
  }
}

export default async function (client: any) {

  const me = await client.getMe();
  const username = me.username ? `(${me.username})` : ''
  // const user = await client.getEntity(algo);
  console.log('Logged in as', me.id, me.firstName, username, client.session.save())

  client.addEventHandler(handler, new NewMessage({ chats }));
  console.info('Listening', chats.length, chats);

}
