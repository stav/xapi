import fs from 'fs'
import XAPI from 'xapi-node'

function doneWritingSymbols(result: any) {
  console.info(`${result.returnData.length} symbols written`)
}

export async function writeAllSymbols(xapi: XAPI) {
  const result: any = await xapi.Socket.send.getAllSymbols()
  // Result [ 'returnData', 'time', 'json', 'transaction' ]
  fs.writeFile('symbols.json', result.json, () => doneWritingSymbols(result))
}
