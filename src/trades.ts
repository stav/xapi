import {
  CMD_FIELD,
} from 'xapi-node'

export function printTrades(trades: any[]) {
  for (let i=0; i<trades.length; i++) {
    const trade = trades[i]
    const type = CMD_FIELD[trade.cmd]
    console.info(
      trades.length > 1 ? `${i+1}.` : '*.',
      'Order', trade.order, trade.order2, trade.position,
      type, trade.symbol,
      '@', trade.open_price,
      'SL', trade.sl,
      'TP', trade.tp,
      trade.profit ? `profit=${trade.profit}` : '\b',
      trade.state ? `(${trade.state})` : '\b',
      trade.customComment ? `"${trade.customComment}"` : '\b',
    )
  }
}
