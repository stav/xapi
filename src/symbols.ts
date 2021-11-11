import fs from 'fs'
import { SYMBOL_RECORD } from 'xapi-node'
import KingBot from './bot'

function doneWritingSymbols(symbolRecords: SYMBOL_RECORD[]): void {
  console.info(`${symbolRecords.length} symbols written`)
}

export async function writeAllSymbols(this: KingBot): Promise<void> {
  console.log('Writing symbols file')
  const result = await this.xapi.Socket.send.getAllSymbols().catch(this.log.error)
  if (result) {
    const symbolRecords: SYMBOL_RECORD[] = result.returnData
    fs.writeFile('symbols.json', result.json, () => doneWritingSymbols(symbolRecords))
  }
}
