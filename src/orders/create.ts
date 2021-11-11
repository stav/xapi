import {
  TRADE_TRANS_INFO,
 } from 'xapi-node'

import KingBot from '../kingbot'
import getOrdersFromTip from './tip'
import getOrdersFromPrice from './price'

export async function buySellTip(this: KingBot): Promise<void> {
  console.info('Buying or selling asset from the Tip')
  const orders: TRADE_TRANS_INFO[] = getOrdersFromTip()
  console.info(orders.length, 'orders to be created')
  for (const order of orders) {
    console.info(JSON.stringify(order))
    await this.xapi.Socket.send.tradeTransaction(order).catch(this.log.error)
  }
}

export async function buySellPrice(this: KingBot): Promise<void> {
  console.info('Buying or selling asset based on current price')
  const orders: TRADE_TRANS_INFO[] = await getOrdersFromPrice( this.xapi.Socket.send.getTickPrices, this.log.error )
  console.info(orders.length, 'orders to be created')
  for (const order of orders) {
    console.info(JSON.stringify(order))
    await this.xapi.Socket.send.tradeTransaction(order).catch(this.log.error)
  }
}
