import XAPI from 'xapi-node'
import { buySellGold, updateStoploss, writeAllSymbols } from './api'

const ctrlC = '\u0003'
const ctrlD = '\u0004'

export default async function (xapi: XAPI) {
  const stdin = process.stdin
  stdin.setEncoding('utf8')
  stdin.setRawMode(true) // false sends chunk after enter is pressed
  await stdin.resume() // running in parent process event loop
  await stdin.on('data', async function ( data: Buffer ) {
    process.stdout.write(JSON.stringify(data) + '\n')
    const key = data.toString()

    if ( key === ctrlC || key === ctrlD ) {
      await xapi.disconnect()
      console.log('Disconnected')
      process.exit();
    }
    else if ( key === '1' ) {
      console.log('Lising')
    }
    else if ( key === '2' ) {
      console.log('Buy or sell gold')
      await buySellGold(xapi)
    }
    else if ( key === '3' ) {
      console.log('Write all symbols')
      await writeAllSymbols(xapi)
    }
    else if ( key === '4' ) {
      console.log('Update stop loss')
      await updateStoploss(xapi)
    }

  })
}
