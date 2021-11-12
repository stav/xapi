import config from 'config'
import { testing as tip } from '../src/orders/tip'
import { testing as price } from '../src/orders/price'

const { isTip } = tip
const { isAsset } = price

function nonAssets(test: any): Array<any> {
  return test.Assets.filter((a: any) => !isAsset(a))
}

describe("Config", () => {

  test("default", () => {
    const configs = config.util.loadFileConfigs()

    expect(configs.Tip).not.toBeUndefined()
    expect(isTip(configs.Tip)).toBe(true)

    expect(configs.Test).not.toBeUndefined()
    expect(configs.Test.Assets).not.toBeUndefined()
    expect(nonAssets(configs.Test)).toHaveLength(0)

    expect(configs.Update).not.toBeUndefined()
    expect(configs.Update).toHaveProperty('entry')
  })

})
