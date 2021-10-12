import dotenv from 'dotenv'
import XAPI from 'xapi-node'
import main from './main'

dotenv.config(); // loads .env into process.env

const xapi = new XAPI({
  accountId: process.env.ACCOUNTID || '',
  password: process.env.PASSWORD || '',
  host: 'ws.xtb.com', // only for XTB accounts
  type: 'demo',
})
xapi.connect()
xapi.onReady(() => main(xapi))
xapi.onReject(console.error)
