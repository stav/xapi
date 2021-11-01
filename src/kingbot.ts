import { setup as setupStdin } from './stdIn'
import KeyedApiRobot from './kingkeys'

export default class extends KeyedApiRobot {

  constructor() {
    super()
  }

  main (): void {
    super.main()
    setupStdin()
    process.stdin.on('data', this.stdIn.bind(this))
  }

}
