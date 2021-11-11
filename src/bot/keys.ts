import StreamingApiRobot from './stream'

const ctrlC = '\u0003'
const ctrlD = '\u0004'
const carriage = ['\n', '\r', '\r\n']

type KeyMap = {
  [key: string]: () => void
}

/** @name KeyedApiRobot
 **/
export default class extends StreamingApiRobot {

  private _keyMap: KeyMap

  constructor() {
    super()
    // We wrap the mapped functions to provide access to `name` property
    // Caution: may not work with future transpiling/minification in production
    // Mapped (inner) functions not bound to instance in this context (use call)
    this._keyMap = {
      [ctrlC]: function Disconnect() { this.disconnect       () },
      [ctrlD]: function Disconnect() { this.disconnect       () },
       //  1 : function _ () { },
       //  2 : function _ () { },
           3 : function Trade_Tip () { this.buySellTip       () },
           4 : function Trade_Prc () { this.buySellPrice     () },
           5 : function Update    () { this.updateTrades     () },
           6 : function Positions () { this.printAllTrades   () },
       //  7 : function _ () { },
       //  8 : function _ () { },
           9 : function Symbols   () { this.writeAllSymbols  () },
       //  0 : function _ () { },
    }
  }

  protected async stdIn (data: Buffer): Promise<void> {
    process.stdout.write('\n' + JSON.stringify(data) + ' ')

    const key: string = data.toString()

    // If the key the user pressed is in the map, it's a function, execute it
    if (key in this._keyMap) {
      this._keyMap[ key ].call(this)
    }
    // Else if the key is the enter key ignore it
    else if (carriage.includes(key)) {
      process.stdout.write('\n')
    }
    // Otherwise show the list of valid keys
    else {
      this._printKeys()
    }
  }

  private _printKeys(): void {
    process.stdout.write('does nothing\n')
    for (const _ in this._keyMap) {
      const func = this._keyMap[_]
      process.stdout.write(''
        + JSON.stringify(_)
        + ' '
        + func.name
        + '\n'
      )
    }
  }

}
