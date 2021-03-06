import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from '../bot'
import Logger from "../log"

type UpdateOrderEvent = Partial<TRADE_TRANS_INFO>

/** @name isBuyOrder */
/**
 * Determine if the given command is for _buying_ (as opposed to _selling_)
 */
function isBuyOrder(cmd: number): boolean {
  return ['BUY', 'BUY_LIMIT', 'BUY_STOP'].includes(CMD_FIELD[cmd])
}

/** @name getLevel */
/**
 * Makes the initial take-profit a little less conservative
 *
 * The `level` in {@link getStopLoss} is the average of open & close unless we
 * are closing TP1 in which case we make the break-even just slightly better
 * than the entry price.
 *
 * @note Technically, the stop loss should, except for TP1, be moved to the
 *   previous TP level, but since we don't have any meta-data about other
 *   orders when we close a TP, the current implementation just sets the SL
 *   to the average of the open & close prices.
 *
 * @todo If somehow the bot misses the break-even from TP1. When we see the
 *   next take-profit, let's say TP2 it will set the SL to the entry price
 *   instead of where it should be (halfway between Open & TP2).
 */
function getLevel(data: STREAMING_TRADE_RECORD): number {
  const _isBuyOrder = isBuyOrder(data.cmd)
  function stoplossWorseThanEntry(): boolean {
    return _isBuyOrder ? data.sl < data.open_price : data.sl > data.open_price
  }
  if (stoplossWorseThanEntry()) {
    return data.open_price
  }
  const level = (data.open_price + data.close_price) / 2
  Logger.info('LEVEL', level, '=', data.open_price, '+', data.close_price, '/', 2)
  return level
}

/** @name getStopLoss */
/**
 */
function getStopLoss(data: STREAMING_TRADE_RECORD): number {
  const level = getLevel(data) // (data.open_price + data.close_price) / 2
  const margin = level * 0.0003
  const betterment = isBuyOrder(data.cmd) ? +margin : -margin
  const stopLoss = +(level + betterment).toFixed(data.digits)
  Logger.info('STOP LOSS:', stopLoss, '=', level, '+', betterment)
  return stopLoss
}

/** @name setFamilyStoploss */
/**
 * Issue order stop-loss modification transactions for all orders in _family_
 */
async function setFamilyStoploss( data: STREAMING_TRADE_RECORD,
                                trades: TRADE_RECORD[],
                      tradeTransaction: Function,
                                ): Promise<void> {
  Logger.info('Updating stop loss for', trades.length, 'orders')
  const transaction: UpdateOrderEvent = {
    type: TYPE_FIELD.MODIFY,
    sl: getStopLoss(data),
  }
  for (const trade of trades) {
    transaction.order = trade.order
    Logger.info('transaction', transaction)
    // The transaction will fail if the take-profit is "worse" than the entry price
    await tradeTransaction(<TRADE_TRANS_INFO>transaction).catch(Logger.error)
  }
}

/** @name checkProfits */
/**
 * Set the family stop loss if our trade is closed due to _take-profit_
 */
 export async function checkProfits (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<void> {
  if (data.closed && data.comment === '[T/P]') {
    this.log.info('TAKE PROFIT', data)
    const trades: TRADE_RECORD[] = await this.getFamilyTrades(data) // TODO Make sure we don't include any pending orders
    if (trades.length > 0) {
      await setFamilyStoploss(data, trades, this.xapi.Socket.send.tradeTransaction)
    }
    await this.printAllTrades()
  }
}

/** @name testing */
/**
 * Public export to expose private methods for testing
 */
const testing = {
  getStopLoss,
  isBuyOrder,
  getLevel,
}

/** @name documentation */
/**
 * Public export to expose private methods for documentation
 */
const documentation = {
  setFamilyStoploss,
}

// Public API
export {
  testing,
  documentation,
}
