import XAPI from 'xapi-node'
// import { ConnectionStatus } from 'xapi-node'
import dotenv from 'dotenv'
import main from './main'

dotenv.config();
// const sleep = (ms: number) => new Promise( res => setTimeout(res, ms))

// const nodeEnv: string = (process.env.NODE_ENVA as string);
// console.log(nodeEnv);

const xapi = new XAPI({
  accountId: process.env.ACCOUNTID || '',
  password: process.env.PASSWORD || '',
  host: 'ws.xtb.com', // only for XTB accounts
  type: 'demo',
})

xapi.connect()
xapi.onReady(ready)
xapi.onReject(console.error)

async function ready() {
  console.log('Connection is ready')
  await main(xapi)
  // while (xapi.Socket.status === ConnectionStatus.CONNECTED) {
  //   await sleep(500)
  // }
}
