import fs from 'fs'

import {
  STREAMING_TRADE_RECORD as StreamingTradeRecord,
} from 'xapi-node'

import error from './error'

function nothing() {}

function jsonLine(data: StreamingTradeRecord | any) {
  return JSON.stringify(data) + '\n'
}

export default function (content: StreamingTradeRecord | any) {
  try {
    fs.appendFile('log.jsonl', jsonLine(content), nothing)
  }
  catch (e: any) {
    error(e)
  }
}
