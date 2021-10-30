import fs from 'fs'
import stream from 'stream'

import { STREAMING_TRADE_RECORD, TRADE_TRANS_INFO } from 'xapi-node'

import error from './error'

type LogRecord = STREAMING_TRADE_RECORD | TRADE_TRANS_INFO

function nothing() {}

export function kingLogger (content: LogRecord): void {
  try {
    const json: string = JSON.stringify(content) + '\n'
    fs.appendFile('./log/king.jsonl', json, nothing)
  }
  catch (e: unknown) {
    error(e)
  }
}

export class debugLogger extends stream.Writable {
  _write(chunk: string | Buffer | Uint8Array, encoding: string, next: Function): void {
    try {
      fs.appendFile('./log/debug.log', chunk.toString() + '\n', nothing)
      next()
    }
    catch (e: unknown) {
      error(e)
    }
  }
}
