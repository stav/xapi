import { STREAMING_TRADE_RECORD } from 'xapi-node'
import SocketApiRobot from './kingapisocket'
import { checkProfits } from './profits'

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
