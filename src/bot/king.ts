import KeyedApiRobot from './keys'

/** @name KingBot
 **/
export default class extends KeyedApiRobot {

  constructor() {
    super()
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
