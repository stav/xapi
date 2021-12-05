import { STREAMING_TRADE_RECORD } from 'xapi-node'
import { checkProfits } from '../lib/profits'
import SocketApiRobot from './socket'

/**
 */
export default class StreamingApiRobot extends SocketApiRobot {

  protected checkProfits: Function

  constructor() {
    super()
    this.checkProfits = checkProfits
    this.xapi.Stream.listen.getTrades(this.tradeEvent.bind(this))
  }

  private async tradeEvent (data: STREAMING_TRADE_RECORD): Promise<void> {
    this.printTrades([data])
    this.checkProfits(data)
    this.log.trade(data)
  }

}
