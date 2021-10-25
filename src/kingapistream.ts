import {
  CMD_FIELD,
  TYPE_FIELD,
  STREAMING_TRADE_RECORD as StreamingTradeRecord,
} from 'xapi-node'

import SocketApiRobot from './kingapisocket'

export default class StreamingApiRobot extends SocketApiRobot {

  constructor() {
    super()
  }

  async listenForTrades() {
    console.info('Listening for trades')
    // xapi.Stream.subscribe.getBalance().catch(console.error)
    await this.xapi.Stream.listen.getTrades((data) => { this.tradeEvent(data) })
    await this.xapi.Stream.subscribe.getTrades().catch(console.error)
  }

  async unListenForTrades() {
    console.info('No longer listening for trades')
    // xapi.Stream.unSubscribe.getBalance().catch(console.error)
    // xapi.Stream.subscribe.getTickPrices('EURUSD').catch(() => { console.error('subscribe for EURUSD failed')})
    await this.xapi.Stream.unSubscribe.getTrades().catch(console.error)
  }

  async tradeEvent (data: StreamingTradeRecord) {
    this.printTrades([data])
    this.log(data)
    if (data.closed && data.comment === '[T/P]') {
      console.log('TAKE PROFIT', data)
      // const positions: number[] = [data.position]
      // const result = await xapi.Socket.send.getTradeRecords(positions)
      // const trades = JSON.parse(result.json).returnData

      const xapiTrades = this.xapi.positions.filter(trade => trade.open_price === data.open_price)
      console.log('xapiTrades', xapiTrades.length)
      this.printTrades(xapiTrades)

      const socketTrades = (await this.getPositions()).filter((trade: any) => trade.open_price === data.open_price)
      console.log('socketTrades', socketTrades.length)
      this.printTrades(socketTrades)

      socketTrades.length && console.log('Updating stop loss')
      for (const trade of socketTrades) {
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
      this.printPositions()
    }
  }

}
