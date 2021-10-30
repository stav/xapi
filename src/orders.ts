import config from 'config'

import { CMD_FIELD, TYPE_FIELD, TRADE_TRANS_INFO } from 'xapi-node'

interface Tip {
  symbol: string
  entry: number
  sl: number
  tps: number[]
  type: 'BUY' | 'SELL'
  volume: number
}

export default function (): TRADE_TRANS_INFO[] {
  const timestamp: number = Date.now()
  const tip: Tip = config.util.loadFileConfigs().Tip
  return tip.tps.map((tp: number) => ({
    order: 0,
    offset: 0,
    symbol: tip.symbol,
    cmd: tip.type === 'SELL' ? CMD_FIELD.SELL_STOP : CMD_FIELD.BUY_STOP,
    price: tip.entry,
    sl: tip.sl,
    tp,
    type: TYPE_FIELD.OPEN,
    volume: tip.volume,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    customComment: 'K1NGbot ' + timestamp,
  }))
}
