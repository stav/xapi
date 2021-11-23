import { StringSession } from 'telegram/sessions'
import dotenv from 'dotenv'

dotenv.config() // loads .env into process.env

export default {
  token: process.env.TOKEN,
  apiId: +(process.env.APIID || 0),
  apiHash: process.env.APIHASH || '',
  session: new StringSession(process.env.SESSION),
  config: { connectionRetries: 5 },
}
