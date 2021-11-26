import { TRADE_TRANS_INFO } from 'xapi-node'

import KingBot from '../bot'

import getOrdersFromTip from './tip'
import getOrdersFromPrice from './price'
import getOrdersFromSignal from './signal'

export function createOrders(this: KingBot, orders: TRADE_TRANS_INFO[]): void {
  this.log.info('Creating', orders.length, 'orders', orders)
  for (const order of orders) {
    this.log.info(JSON.stringify(order))
    this.xapi.Socket.send.tradeTransaction(order).catch(this.log.error)
  }
}

export async function createOrdersFromTip(this: KingBot): Promise<void> {
  this.log.info('Creating orders for asset from the Tip')
  const orders: TRADE_TRANS_INFO[] = getOrdersFromTip()
  this.createOrders(orders)
}

export async function createOrdersHedge(this: KingBot): Promise<void> {
  this.log.info('Creating hedge orders for asset based on current price')
  const getTickPrices = this.xapi.Socket.send.getTickPrices
  const orders: TRADE_TRANS_INFO[] = await getOrdersFromPrice(getTickPrices, this.log.error)
  this.createOrders(orders)
}

export function createOrdersFromTelegram(this: KingBot, signal: any): void {
  this.log.info('Creating orders for asset based on Telegram signal', signal)
  const orders: TRADE_TRANS_INFO[] = getOrdersFromSignal(signal)
  this.createOrders(orders)
}
