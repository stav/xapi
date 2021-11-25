import { TelegramClient } from 'telegram'
import KingBot from '../king'
import Listen from './listen'
import auth from './auth'

async function nic(x: any) { return x }

export default async function Client (kingbot: KingBot) {

  const client = new TelegramClient(
    auth.session,
    auth.apiId,
    auth.apiHash,
    auth.config
  )

  await client.start({
    // Login requires session for now
    phoneNumber: async () => await nic(''),
    phoneCode  : async () => await nic(0),
    password   : async () => await nic(0),
    onError    : console.error,
  })

  Listen(kingbot, client)

  return client

}
