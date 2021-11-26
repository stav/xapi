import StreamingApiRobot from './stream'

const ctrlC = '\u0003'
const ctrlD = '\u0004'
const carriage = ['\n', '\r', '\r\n']

type KeyMap = {
  [key: string]: () => void
}

/**
 */
export default class KeyedApiRobot extends StreamingApiRobot {

  private _keyMap: KeyMap

  constructor() {
    super()
    // We wrap the mapped functions to provide access to `name` property
    // Caution: may not work with future transpiling/minification in production
    // Mapped (inner) functions not bound to instance in this context (use call)
    this._keyMap = {
      [ctrlC]: function Disconnect() { this.disconnect         () },
      [ctrlD]: function Disconnect() { this.disconnect         () },
           1 : function Connect_XA() { this.connect_xapi       () },
           2 : function Connect_Te() { this.connect_telegram   () },
           3 : function Trade_Tip () { this.createOrdersFromTip() },
           4 : function Trade_Prc () { this.createOrdersHedge  () },
           5 : function Update    () { this.updateTrades       () },
           6 : function Positions () { this.printAllTrades     () },
       //  7 : function _ () { },
       //  8 : function _ () { },
           9 : function Symbols   () { this.writeAllSymbols    () },
           0 : function Status    () { this.printStatus        () },
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

  /**
   *     "?" does nothing
   *     "1" Connect_XA
   *     "2" Connect_Te
   *     "3" Trade_Tip
   *     "4" Trade_Prc
   *     "5" Update
   *     "6" Positions
   *     "9" Symbols
   *     "\u0003" Disconnect
   *     "\u0004" Disconnect
   */
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
