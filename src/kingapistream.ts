import {
  CMD_FIELD,
  TYPE_FIELD,
  TRADE_RECORD,
  STREAMING_TRADE_RECORD,
} from 'xapi-node'

import SocketApiRobot from './kingapisocket'

export default class StreamingApiRobot extends SocketApiRobot {

  constructor() {
    super()
    this.xapi.Stream.listen.getTrades(this.tradeEvent.bind(this))
  }

  async listenForTrades() {
    console.info('Listening for trades')
    await this.xapi.Stream.subscribe.getTrades().catch(console.error)
  }

  async unListenForTrades() {
    console.info('No longer listening for trades')
    await this.xapi.Stream.unSubscribe.getTrades().catch(console.error)
  }

  async tradeEvent (data: STREAMING_TRADE_RECORD) {
    this.printTrades([data])
    this.log(data)
    if (data.closed && data.comment === '[T/P]') {
      console.log('TAKE PROFIT', data)

      const trades: TRADE_RECORD[] = (await this.getPositions()).filter((trade: any) => trade.open_price === data.open_price)
      console.log('trades', trades.length)
      this.printTrades(trades)

      trades.length && console.log('Updating stop loss')
      for (const trade of trades) {
        const betterment = data.cmd === CMD_FIELD.SELL ? -0.50 : 0.50
        const transaction: any = {
          order: trade.order,
          type: TYPE_FIELD.MODIFY,
          sl: data.open_price + betterment,
        }
        console.log('transaction', transaction)
        try {
          await this.xapi.Socket.send.tradeTransaction(transaction)
        }
        catch (e: any) {
          this.error(e)
        }
      }
      await this.printPositions()
    }
  }

}
