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
    const configs = config.util.loadFileConfigs()

    expect(configs.Tip).toBeDefined()
    expect(isTip(configs.Tip)).toBe(true)

    expect(configs.Test).toBeDefined()
    expect(configs.Test.Assets).toBeDefined()
    expect(nonAssets(configs.Test)).toHaveLength(0)

    expect(configs.Update).toBeDefined()
    expect(configs.Update).toHaveProperty('entry')
  })

})
