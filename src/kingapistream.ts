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

  protected async listenForTrades(): Promise<void> {
    console.info('Listening for trades')
    await this.xapi.Stream.subscribe.getTrades().catch(this.console.error)
  }

  protected async unListenForTrades(): Promise<void> {
    console.info('No longer listening for trades')
    await this.xapi.Stream.unSubscribe.getTrades().catch(this.console.error)
  }

  private async tradeEvent (data: STREAMING_TRADE_RECORD): Promise<void> {
    this.printTrades([data])
    this.checkProfits(data)
    this.log(data)
  }

}
