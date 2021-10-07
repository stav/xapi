import XAPI from 'xapi-node'
import dotenv from 'dotenv';

dotenv.config();

// const nodeEnv: string = (process.env.NODE_ENVA as string);
// console.log(nodeEnv);

const xapi = new XAPI({
  accountId: process.env.ACCOUNTID || '',
  password: process.env.PASSWORD || '',
  type: 'demo'
})

xapi.connect()
xapi.onReady(ready)
xapi.onReject(console.error)

async function ready() {
  console.log('Connection is ready')
  await xapi.disconnect()
  console.log('Disconnected')
}
