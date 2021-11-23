import { TRADE_TRANS_INFO } from 'xapi-node'

import KingBot from '../bot'
import getOrdersFromTip from './tip'
import getOrdersFromPrice from './price'

export async function createOrders(this: KingBot, orders: TRADE_TRANS_INFO[]): Promise<void> {
  console.info('Creating', orders.length, 'orders', orders)
  for (const order of orders) {
    console.info(JSON.stringify(order))
    await this.xapi.Socket.send.tradeTransaction(order).catch(this.log.error)
  }
}

export async function createOrdersFromTip(this: KingBot): Promise<void> {
  console.info('Creating orders for asset from the Tip')
  const orders: TRADE_TRANS_INFO[] = getOrdersFromTip()
  await this.createOrders(orders)
}

export async function createOrdersHedge(this: KingBot): Promise<void> {
  console.info('Creating hedge orders for asset based on current price')
  const getTickPrices = this.xapi.Socket.send.getTickPrices
  const orders: TRADE_TRANS_INFO[] = await getOrdersFromPrice(getTickPrices, this.log.error)
  await this.createOrders(orders)
}
