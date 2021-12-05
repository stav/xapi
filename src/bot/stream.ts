import { STREAMING_TRADE_RECORD, STREAMING_KEEP_ALIVE_RECORD } from 'xapi-node'
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

  private async keepAliveListener (data: STREAMING_KEEP_ALIVE_RECORD): Promise<void> {
    this.timestamp = data.timestamp
  }

  connect_xapi (readyCallback: ()=>void): void {
    let callback
    if (readyCallback) { // Probably testing
      callback = readyCallback
    }
    else {
      callback = () => {
        this.xapi.Stream.listen.getKeepAlive(this.keepAliveListener.bind(this))
        this.xapi.Stream.subscribe.getKeepAlive().catch(console.error)
      }
    }
    super.connect_xapi(callback)
  }

}
