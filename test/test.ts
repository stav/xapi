import K1NG from '../src/bot'

describe("WebSocket Server", () => {

  let king: K1NG

  beforeAll(() => {
    king = new K1NG()
  })

  afterAll(() => {
    king.disconnect()
  })

  test("Check the node env", () => {
    expect(king.isTestMode).toBe(true)
  })

  test("Check the startup bot status", () => {
    expect(king.isConnected).toBe(false)
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
    king.connect(callback)
  })

})
