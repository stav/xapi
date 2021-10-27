import fs from 'fs'
import stream from 'stream'

import {
  STREAMING_TRADE_RECORD as StreamingTradeRecord,
} from 'xapi-node'

import error from './error'

function nothing() {}

function jsonLine(data: StreamingTradeRecord | any) {
  return JSON.stringify(data) + '\n'
}

export function kingLogger (content: StreamingTradeRecord | any) {
  try {
    fs.appendFile('./log/king.jsonl', jsonLine(content), nothing)
  }
  catch (e: any) {
    error(e)
  }
}

export class debugLogger extends stream.Writable {
  _write(chunk: string | Buffer | Uint8Array, encoding: string, next: Function) {
    try {
      fs.appendFile('./log/debug.log', chunk.toString() + '\n', nothing)
      next()
    }
    catch (e: any) {
      error(e)
    }
  }
}
