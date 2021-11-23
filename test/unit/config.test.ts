import config from 'config'
import { testing as tip } from '../../src/orders/tip'
import { testing as price } from '../../src/orders/price'

const { isTip } = tip
const { isAsset } = price

function nonAssets(test: any): Array<any> {
  return test.Assets.filter((a: any) => !isAsset(a))
}

describe("Config", () => {

  test("default", () => {

    const Tip = config.get('Tip')
    expect(Tip).toBeDefined()
    expect(isTip(Tip)).toBe(true)

    const Hedge = config.get('Hedge')
    const Assets = config.get('Hedge.Assets')
    expect(Hedge).toBeDefined()
    expect(Assets).toBeDefined()
    expect(nonAssets(Hedge)).toHaveLength(0)

    const Update = config.get('Update')
    expect(Update).toBeDefined()
    expect(Update).toHaveProperty('entry')

  })

})
