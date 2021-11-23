import { StringSession } from 'telegram/sessions'
import config from 'config'

export default {
  token: config.get('Telegram.token'),
  apiId: +(config.get('Telegram.apiId') as number),
  apiHash: config.get('Telegram.apiHash') as string,
  session: new StringSession(config.get('Telegram.session')),
  config: { connectionRetries: 5 },
}
