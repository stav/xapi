import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  TRADE_TRANS_INFO,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import SocketApiRobot from './kingapisocket'

type UpdateTransactionEvent = Partial<TRADE_TRANS_INFO>

export default class StreamingApiRobot extends SocketApiRobot {

  constructor() {
    super()
    this.xapi.Stream.listen.getTrades(this.tradeEvent.bind(this))
  }

  async listenForTrades(): Promise<void> {
    console.info('Listening for trades')
    await this.xapi.Stream.subscribe.getTrades().catch(console.error)
  }

  async unListenForTrades(): Promise<void> {
    console.info('No longer listening for trades')
    await this.xapi.Stream.unSubscribe.getTrades().catch(console.error)
  }

  private async _getFamilyTrades(data: STREAMING_TRADE_RECORD): Promise<TRADE_RECORD[]> {
    const trades: TRADE_RECORD[] = await this.getAllTrades()
    return trades.filter((trade: TRADE_RECORD) => trade.open_price === data.open_price)
  }

  async tradeEvent (data: STREAMING_TRADE_RECORD): Promise<void> {
    this.printTrades([data])
    this.log(data)
    if (data.closed && data.comment === '[T/P]') {
      console.log('TAKE PROFIT', data)

      const trades: TRADE_RECORD[] = await this._getFamilyTrades(data)
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

}
