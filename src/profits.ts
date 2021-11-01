import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

type UpdateTransactionEvent = Partial<TRADE_TRANS_INFO>

export async function takeProfits (this: any, data: STREAMING_TRADE_RECORD): Promise<void> {
  if (data.closed && data.comment === '[T/P]') {
    console.log('TAKE PROFIT', data)

    const trades: TRADE_RECORD[] = await this.getFamilyTrades(data)
    console.log('Family trades', trades.length)
    this.printTrades(trades)

    trades.length && console.log('Updating stop loss')
    for (const trade of trades) {
      const betterment = data.cmd === CMD_FIELD.SELL ? -0.50 : 0.50
      const transaction: UpdateTransactionEvent = {
        order: trade.order,
        type: TYPE_FIELD.MODIFY,
        sl: data.open_price + betterment,
      }
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
