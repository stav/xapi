import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from './kingbot'

type UpdateOrderEvent = Partial<TRADE_TRANS_INFO>

function _isBuyOrder(cmd: number): boolean {
  return ['BUY', 'BUY_LIMIT', 'BUY_STOP'].includes(CMD_FIELD[cmd])
}

function getLevel(data: STREAMING_TRADE_RECORD): number {
  const isBuyOrder = _isBuyOrder(data.cmd)
  function stoplossWorseThanEntry(): boolean {
    return isBuyOrder ? data.sl < data.open_price : data.sl > data.open_price
  }
  if (stoplossWorseThanEntry()) {
    return data.open_price
  }
  const level = (data.open_price + data.close_price) / 2
  console.log('LEVEL', level, '=', data.open_price, '+', data.close_price, '/', 2)
  return level
}

function getStopLoss(data: STREAMING_TRADE_RECORD): number {
  const margin = data.open_price * 0.0003
  const isBuyOrder = _isBuyOrder(data.cmd)
  const betterment = isBuyOrder ? +margin : -margin
  const level = getLevel(data)
  const stopLoss = +(level + betterment).toFixed(data.digits)
  console.log('STOP LOSS:', stopLoss, '=', level, '+', betterment)
  return stopLoss
}

async function setFamilyStoploss( data: STREAMING_TRADE_RECORD,
                                trades: TRADE_RECORD[],
                      tradeTransaction: Function,
                                 error: Function
                                ): Promise<void> {
  console.log('Updating stop loss for', trades.length, 'orders')
  const transaction: UpdateOrderEvent = {
    type: TYPE_FIELD.MODIFY,
    sl: getStopLoss(data),
  }
  for (const trade of trades) {
    transaction.order = trade.order
    console.log('transaction', transaction)
    // The transaction will fail if the take-profit is "worse" than the entry price
    await tradeTransaction(<TRADE_TRANS_INFO>transaction).catch(error)
  }
}

export async function checkProfits (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<void> {
  if (data.closed && data.comment === '[T/P]') {
    console.log('TAKE PROFIT', data)
    const trades: TRADE_RECORD[] = await this.getFamilyTrades(data) // TODO Make sure we don't include any pending orders
    if (trades.length > 0) {
      await setFamilyStoploss(data, trades, this.xapi.Socket.send.tradeTransaction, this.console.error)
    }
    await this.printAllTrades()
  }
}
