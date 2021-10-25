import { setup as setupStdin } from './stdIn'
import KeyedApiRobot from './kingkeys'
import { KeyMap } from './kingkeys'

export default class extends KeyedApiRobot {

  constructor() {
    super()
  }

  main () {
    super.main()
    setupStdin()
    process.stdin.on('data', (data) => this.stdIn(data))
  }

}
