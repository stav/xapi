import fs from 'fs'
import XAPI from 'xapi-node'
import { SYMBOL_RECORD } from 'xapi-node'

function doneWritingSymbols(symbolRecords: SYMBOL_RECORD[]): void {
  console.info(`${symbolRecords.length} symbols written`)
}

export async function writeAllSymbols(xapi: XAPI): Promise<void> {
  console.log('Writing symbols file')
  const result = await xapi.Socket.send.getAllSymbols().catch(console.warn)
  if (result) {
    const symbolRecords: SYMBOL_RECORD[] = result.returnData
    fs.writeFile('symbols.json', result.json, () => doneWritingSymbols(symbolRecords))
  }
}
