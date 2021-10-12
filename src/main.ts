import XAPI from 'xapi-node'
import { ConnectionStatus } from 'xapi-node'
import { STREAMING_TRADE_RECORD as streamingTradeRecord } from 'xapi-node'
import { STREAMING_TRADE_STATUS_RECORD as streamingTradeStatusRecord } from 'xapi-node'

import { buySellGold, updateStoploss, writeAllSymbols } from './api'

const ctrlC = '\u0003'
const ctrlD = '\u0004'

function getTrades (data: streamingTradeRecord) {
  console.log('getTrades', data)
}

function getTradeStatus (data: streamingTradeStatusRecord) {
  console.log('getTradeStatus', data)
}

export default async function (xapi: XAPI) {
  console.log('Socket is:', ConnectionStatus[xapi.Socket.status])

  const stdin = process.stdin
  stdin.setEncoding('utf8')
  stdin.setRawMode(true) // false sends chunk after enter is pressed
  await stdin.resume() // running in parent process event loop

  await stdin.on('data', async function ( data: Buffer ) {
    // xapi is being hoisted from (main) the outer function
    process.stdout.write(JSON.stringify(data) + ' ')
    const key = data.toString()

    if ( key === ctrlC || key === ctrlD ) {
      process.stdout.write('disconnecting... ')
      await xapi.disconnect()
      process.stdout.write(`${ConnectionStatus[xapi.Socket.status]}\n`)
      process.exit();
    }
    else if ( key === '1' ) {
      console.log('Trades')
      // xapi.Stream.subscribe.getBalance().catch(console.error)
      xapi.Stream.listen.getTrades(getTrades)
      xapi.Stream.listen.getTradeStatus(getTradeStatus)
      xapi.Stream.subscribe.getTrades().catch(console.error)
      xapi.Stream.subscribe.getTradeStatus().catch(console.error)
    }
    else if ( key === '2' ) {
      console.log('UNListing')
      // xapi.Stream.unSubscribe.getBalance().catch(console.error)
      // xapi.Stream.subscribe.getTickPrices('EURUSD').catch(() => { console.error('subscribe for EURUSD failed')})
      xapi.Stream.unSubscribe.getTrades().catch(console.error)
      xapi.Stream.unSubscribe.getTradeStatus().catch(console.error)
    }
    else if ( key === '3' ) {
      console.log('Buy or sell gold')
      await buySellGold(xapi)
    }
    else if ( key === '4' ) {
      console.log('Write all symbols')
      await writeAllSymbols(xapi)
    }
    else if ( key === '5' ) {
      console.log('Update stop loss')
      await updateStoploss(xapi)
    }
    else {
      process.stdout.write('does nothing\n')
    }

  })
}
