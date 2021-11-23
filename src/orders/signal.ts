import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_TRANS_INFO,
 } from 'xapi-node'

interface Signal {
  symbol: string
  entry: string
  sl: string
  tps: number[]
  type: 'BUY' | 'SELL'
  volume: number
}

export default function (signal: Signal): TRADE_TRANS_INFO[] {
  console.log('nice, signal', signal)

  const timestamp: number = Date.now()
  let tpLevel: number = 0
  return signal.tps.map((tp: number) => ({
    order: 0,
    offset: 0,
    symbol: signal.symbol,
    cmd: signal.type === 'SELL' ? CMD_FIELD.SELL_STOP : CMD_FIELD.BUY_STOP,
    price: +signal.entry,
    sl: +signal.sl,
    tp,
    type: TYPE_FIELD.OPEN,
    volume: signal.volume,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    customComment: 'K1NGbot ' + timestamp + ' TP' + ++tpLevel,
  }))

}
