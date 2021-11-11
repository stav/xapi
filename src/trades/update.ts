import config from 'config'

import {
  TRADE_TRANS_INFO,
  REQUEST_STATUS_FIELD,
  TradeStatus as TRADE_STATUS,
} from 'xapi-node'

import KingBot from '../bot'

interface EntryInfo {
  entry: number
}
type UpdateTransactionInfo = TRADE_TRANS_INFO & EntryInfo
type TradeStatus = TRADE_STATUS | void

/** @name updateTrades
 **/
export async function updateTrades(this: KingBot): Promise<void> {
  const getTradeRecords = this.xapi.Socket.send.getTradeRecords
  const tradeTransaction = this.xapi.Socket.send.tradeTransaction
  const tradeTransactionStatus = this.xapi.Socket.send.tradeTransactionStatus

  const update: UpdateTransactionInfo = config.util.loadFileConfigs().Update
  const entry: number = update.entry
  const trades = this.xapi.positions.filter(trade => trade.open_price === entry) // TODO: could be stop loss or family-trades or something
  console.log('Update trades with open price of', entry)
  this.printTrades(trades)
  let count = 0

  for (const trade of trades) {
    // The next line shadows `entry` just for this (for) block in order to not include it in `transaction`
    const { entry, ...transaction } = Object.assign({}, {order: trade.order}, update)
    console.log('transaction', transaction)
    const result: TradeStatus = await tradeTransaction(transaction).catch(this.log.error) // Need to retry failed transaction
    if (result) {
      // TODO: Watch for duplicate orders
      if (result.requestStatus === REQUEST_STATUS_FIELD.ACCEPTED) {
        const status = await tradeTransactionStatus(result.order).catch(this.log.error) // Need to retry failed transaction
        if (status) {
          if (status.returnData.requestStatus === REQUEST_STATUS_FIELD.ACCEPTED) {
            count++
          }
          else if (status.returnData.requestStatus === REQUEST_STATUS_FIELD.PENDING) {
            this.log.error('Update trades status:', status.returnData.message)
          }
          else {
            this.log.error(new Error('Update trades status not accepted:'), status.returnData)
          }
        }
      }
      else {
        this.log.error(new Error('Update trades request not accepted:'), result)
      }
    }
  }
  console.log('Updated', count, 'trades with entry', entry)
  const positions: number[] = trades.map(trade => trade.position)
  const result = await getTradeRecords(positions).catch(this.log.error)
  if (result) {
    const updatedTrades = JSON.parse(result.json).returnData
    this.printTrades(updatedTrades)
  }
}
