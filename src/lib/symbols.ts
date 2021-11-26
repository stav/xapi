import fs from 'fs'
import { SYMBOL_RECORD } from 'xapi-node'
import KingBot from '../bot'
import Logger from '../log'

function doneWritingSymbols(symbolRecords: SYMBOL_RECORD[]): void {
  Logger.info(`${symbolRecords.length} symbols written`)
}

/** @name writeAllSymbols */
/**
 * Get the full asset list for all supported symbols from the server
 * and write them to a file called `symbols.json`
 */
export async function writeAllSymbols(this: KingBot): Promise<void> {
  this.log.info('Writing symbols file')
  const result = await this.xapi.Socket.send.getAllSymbols().catch(this.log.error)
  if (result) {
    const symbolRecords: SYMBOL_RECORD[] = result.returnData
    fs.writeFile('symbols.json', result.json, () => doneWritingSymbols(symbolRecords))
  }
}
