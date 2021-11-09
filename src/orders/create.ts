import {
  TRADE_TRANS_INFO,
 } from 'xapi-node'

import KingBot from '../kingbot'
import getOrdersFromTip from './tip'
import getOrdersFromPrice from './price'

async function buySellOrders( orders: TRADE_TRANS_INFO[],
                    tradeTransaction: Function,
                               error: Function,
                                 log: Function,
                            ): Promise<void> {
  console.info(orders.length, 'orders to be created')
  for (const order of orders) {
    console.info(JSON.stringify(order))
    await tradeTransaction(order).catch(error)
    log(order)
  }
}

export async function buySellTip(this: KingBot): Promise<void> {
  console.info('Buying or selling asset from the Tip')
  await buySellOrders(
    getOrdersFromTip(),
    this.xapi.Socket.send.tradeTransaction,
    this.console.error,
    this.log,
  )
}

export async function buySellPrice(this: KingBot): Promise<void> {
  console.info('Buying or selling asset based on current price')
  await buySellOrders(
    await getOrdersFromPrice( this.xapi.Socket.send.getTickPrices, this.console.error ),
    this.xapi.Socket.send.tradeTransaction,
    this.console.error,
    this.log,
  )
}
