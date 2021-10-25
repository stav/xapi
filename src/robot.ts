import fs from 'fs'

import {
  STREAMING_TRADE_RECORD as StreamingTradeRecord,
} from 'xapi-node'

function nothing() {}

function jsonLine(data: StreamingTradeRecord | any) {
  return JSON.stringify(data) + '\n'
}

export default class Robot {

  constructor() {
  }

  protected error (e: any) {
    let message = ''
    if (e.message) {
      message += ' | ' + e.message
    }
    if (e.params?.reason) {
      message += ' | ' + JSON.stringify(e.params.reason)
    }
    if (!message) {
      message = e.toString()
    }
    console.error(message)
  }

  async log(content: StreamingTradeRecord | any) {
    try {
      fs.appendFile('log.jsonl', jsonLine(content), nothing)
    }
    catch (e: any) {
      this.error(e)
    }
  }

}
