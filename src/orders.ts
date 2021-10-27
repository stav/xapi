import config from 'config'

import {
  CMD_FIELD,
  TYPE_FIELD,
} from 'xapi-node'

export default function () {
  const timestamp: number = Date.now()
  const tip: any = config.util.loadFileConfigs().Tip
  return tip.tp.map((tp: any) => ({
    order: 0,
    offset: 0,
    symbol: tip.symbol,
    cmd: tip.type === 'SELL' ? CMD_FIELD.SELL_STOP : CMD_FIELD.BUY_STOP,
    price: tip.entry,
    sl: tip.sl,
    tp: tp,
    type: TYPE_FIELD.OPEN,
    volume: tip.volume,
    expiration: new Date().getTime() + 60000 * 60 * 24 * 365,
    customComment: 'K1NGbot ' + timestamp,
  }))
}
