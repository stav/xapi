import exp from 'constants'
import {
  CMD_FIELD,
  STREAMING_TRADE_RECORD,
 } from 'xapi-node'

import { testing } from "../../src/lib/profits"

const { getLevel, getStopLoss, isBuyOrder } = testing

const event: Partial<STREAMING_TRADE_RECORD> = {
  close_price: 200,
  open_price: 100,
  digits: 2,
  cmd: CMD_FIELD.BUY,
  sl: 10,
}

describe("Profits", () => {

  test("isBuyOrder", () => {
    expect(isBuyOrder(CMD_FIELD.BUY)).toBe(true)
    expect(isBuyOrder(CMD_FIELD.BUY_LIMIT)).toBe(true)
    expect(isBuyOrder(CMD_FIELD.BUY_STOP)).toBe(true)
    expect(isBuyOrder(CMD_FIELD.SELL)).toBe(false)
    expect(isBuyOrder(CMD_FIELD.SELL_LIMIT)).toBe(false)
    expect(isBuyOrder(CMD_FIELD.SELL_STOP)).toBe(false)
    expect(isBuyOrder(CMD_FIELD.BALANCE)).toBe(false)
    expect(isBuyOrder(CMD_FIELD.CREDIT)).toBe(false)
  })

  test("getLevel", () => {
    expect(getLevel(<STREAMING_TRADE_RECORD>event)).toBe(100)
    const data = Object.assign({}, event, { sl: 101 })
    expect(getLevel(<STREAMING_TRADE_RECORD>data)).toBe(150)
  })

  test("getStopLoss", () => {
    expect(getStopLoss(<STREAMING_TRADE_RECORD>event)).toBe(100.03)
    const data = Object.assign({}, event, { sl: 101 })
    expect(getStopLoss(<STREAMING_TRADE_RECORD>data)).toBe(150.04)
  })

})
