import K1NG from '../../src/bot'

describe("Connection", () => {

  let king: K1NG

  beforeAll(() => {
    king = new K1NG()
  })

  afterAll(async () => {
    await king.disconnect()
  })

  test("Check the startup bot status", () => {
    expect(king.isConnected).toBe(false)
    expect(king.isTestMode).toBe(true)
  })

  test('Check the connected bot status', done => {
    function callback() {
      try {
        expect(king.isConnected).toBe(true)
        done()
      } catch (error) {
        done(error)
      }
    }
    king.connect_xapi(callback)
  })

})
