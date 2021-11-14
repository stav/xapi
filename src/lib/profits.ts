import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../bot'

type UpdateOrderEvent = Partial<TRADE_TRANS_INFO>

function isBuyOrder(cmd: number): boolean {
  return ['BUY', 'BUY_LIMIT', 'BUY_STOP'].includes(CMD_FIELD[cmd])
}

/** @name getLevel
 **
 ** This function makes the initial take-profit a little less conservative
 **
 ** The `level` in `getStopLoss` could just be the avg of open & close but if
 ** we are closing TP1 then make the break-even only just better than the entry
 ** price.
 **
 ** @todo If somehow the bot misses the break-even from TP1. When we see the
 **   next take-profit, let's say TP2 it will set the SL to the entry price
 **   instead of where it should be (halfway between Open & TP2).
 **
 ** @note Technically, the stop loss should, except for TP1, be moved to the
 **   previous TP level; but, since we don't have get any meta-data about other
 **   orders when we close a TP, the current implementation just sets the SL
 **   to the average of the open & close prices.
 **/
function getLevel(data: STREAMING_TRADE_RECORD): number {
  const _isBuyOrder = isBuyOrder(data.cmd)
  function stoplossWorseThanEntry(): boolean {
    return _isBuyOrder ? data.sl < data.open_price : data.sl > data.open_price
  }
  if (stoplossWorseThanEntry()) {
    return data.open_price
  }
  const level = (data.open_price + data.close_price) / 2
  console.info('LEVEL', level, '=', data.open_price, '+', data.close_price, '/', 2)
  return level
}

/** @name getStopLoss
 **/
function getStopLoss(data: STREAMING_TRADE_RECORD): number {
  const level = getLevel(data) // (data.open_price + data.close_price) / 2
  const margin = data.open_price * 0.0003
  const betterment = isBuyOrder(data.cmd) ? +margin : -margin
  const stopLoss = +(level + betterment).toFixed(data.digits)
  console.info('STOP LOSS:', stopLoss, '=', level, '+', betterment)
  return stopLoss
}

/** @name getFamilyTrades
 **/
async function setFamilyStoploss( data: STREAMING_TRADE_RECORD,
                                trades: TRADE_RECORD[],
                      tradeTransaction: Function,
                                 error: Function
                                ): Promise<void> {
  console.info('Updating stop loss for', trades.length, 'orders')
  const transaction: UpdateOrderEvent = {
    type: TYPE_FIELD.MODIFY,
    sl: getStopLoss(data),
  }
  for (const trade of trades) {
    transaction.order = trade.order
    console.info('transaction', transaction)
    // The transaction will fail if the take-profit is "worse" than the entry price
    await tradeTransaction(<TRADE_TRANS_INFO>transaction).catch(error)
  }
}

/** @name checkProfits
 **/
export async function checkProfits (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<void> {
  if (data.closed && data.comment === '[T/P]') {
    console.info('TAKE PROFIT', data)
    const trades: TRADE_RECORD[] = await this.getFamilyTrades(data) // TODO Make sure we don't include any pending orders
    if (trades.length > 0) {
      await setFamilyStoploss(data, trades, this.xapi.Socket.send.tradeTransaction, this.log.error)
    }
    await this.printAllTrades()
  }
}
