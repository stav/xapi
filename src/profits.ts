import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import KingBot from './kingbot'

type UpdateOrderEvent = Partial<TRADE_TRANS_INFO>

function getStopLoss(data: STREAMING_TRADE_RECORD, trades: TRADE_RECORD[]) {
  const margin = data.open_price * 0.0003
  const betterment = data.cmd === CMD_FIELD.BUY ? margin : margin * -1
  const tps: number[] = trades.map(trade => trade.tp)
  console.log('getStopLoss', tps)
  return parseInt(`${data.open_price + betterment}`) // TODO: Don't use parseInt: Need to check trade.digits and truncate
}

function getTransaction(data: STREAMING_TRADE_RECORD, trades: TRADE_RECORD[]) {
  return {
    type: TYPE_FIELD.MODIFY,
    sl: getStopLoss(data, trades),
  }
}

export async function takeProfits (this: KingBot, data: STREAMING_TRADE_RECORD): Promise<void> {
  if (data.closed && data.comment === '[T/P]') {
    console.log('TAKE PROFIT', data)
    const trades: TRADE_RECORD[] = await this.getFamilyTrades(data)
    const transaction: UpdateOrderEvent = getTransaction(data, trades)
    trades.length && console.log('Updating stop loss for', trades.length, 'orders')

    for (const trade of trades) {
      transaction.order = trade.order
      console.log('transaction', transaction)
      try {
        // The transaction will fail if the take-profit is "worse" than the entry price
        await this.xapi.Socket.send.tradeTransaction(<TRADE_TRANS_INFO>transaction)
      }
      catch (e: unknown) {
        this.error(e)
      }
    }
    await this.printAllTrades()
  }
}
