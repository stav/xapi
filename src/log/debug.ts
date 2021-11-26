import fs from 'fs'
import stream from 'stream'

import { printErrorToConsole } from './error'

export default class DebugLogger extends stream.Writable {
  _write(chunk: string | Buffer | Uint8Array, encoding: string, next: Function): void {
    try {
      fs.appendFile('./log/debug.log', chunk.toString() + '\n', ()=>{})
      next()
    }
    catch (e: unknown) {
      printErrorToConsole(e, chunk)
    }
  }
}
