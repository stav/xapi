import { TelegramClient } from 'telegram'
import Listen from './listen'
import auth from './auth'

async function nic(x: any) { return x }

export default async function Client () {

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

  Listen(client);

  return client;

}
