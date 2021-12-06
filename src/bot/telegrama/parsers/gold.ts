const re = /XAUUSD (?<type>BUY|SELL)\s+ENTRADA:\s*(?<entry>[\d.]+)\s+SL:\s*(?<sl>[\d.]+)\s+(?<tps>.+)/s

/** @name parseMessageSignal */
/**
 *
 * This is a parser of signals in the format:
 *
 *   XAUUSD BUY
 *   ENTRADA: 1806
 *
 *   SL: 1796
 *   TP1: 1808
 *   TP2: 1812
 *   TP3: 1821
 *
 * @note The number of TP levels can be variable but we need at least one.
 *
 * @param text
 *
 * @returns { type:'BUY', entry:'1806', sl:'1796', tps:[ 1808, 1812, 1821 ] }
 */
export default function parseMessageSignal (text: string): any {
  const message = text || ''
  const m: any = message.match(re)?.groups || ''
  const symbol = 'GOLD'
  const volume = 0.01

  function tpLabelMap(tpLabel: string) {
    const tpMatch = tpLabel.trim().match(/[\d.]+$/) || [0]
    return +tpMatch[0]
  }

  const tps = m.tps.split('\n').map(tpLabelMap).filter(Boolean)
  const signal = Object.assign( { symbol, volume }, m, { tps } )
  return signal
}
