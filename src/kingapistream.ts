import { STREAMING_TRADE_RECORD } from 'xapi-node'
import SocketApiRobot from './kingapisocket'
import { takeProfits } from './profits'

export default class StreamingApiRobot extends SocketApiRobot {

  protected takeProfits: Function

  constructor() {
    super()
    this.takeProfits = takeProfits
    this.xapi.Stream.listen.getTrades(this.tradeEvent.bind(this))
  }

  protected async listenForTrades(): Promise<void> {
    console.info('Listening for trades')
    await this.xapi.Stream.subscribe.getTrades().catch(console.error)
  }

  protected async unListenForTrades(): Promise<void> {
    console.info('No longer listening for trades')
    await this.xapi.Stream.unSubscribe.getTrades().catch(console.error)
  }

  private async tradeEvent (data: STREAMING_TRADE_RECORD): Promise<void> {
    this.printTrades([data])
    this.takeProfits(data)
    this.log(data)
  }

}
