import KeyedApiRobot from './keys'

/**
 * Typescript doesn't support multiple inheritance so we extend linearly
 */
export default class KingBot extends KeyedApiRobot {

  constructor() {
    super()
    this.main()
  }

  main (): void {
    super.main()
    if (!this.isTestMode) {
      process.stdin.setEncoding('utf8')
      process.stdin.setRawMode(true) // false sends chunk after enter is pressed
      process.stdin.resume() // running in parent process event loop
      process.stdin.on('data', this.stdIn.bind(this))
    }
  }

}
