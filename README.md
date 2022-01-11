# K1NGBOT

The bot is a NodeJS command line application that has the ability to open a
multi-order position on XTB's XStation 5 appliance. It can listen for Telegram
messages, open orders on XTB and monitor trade events via a websocket connection.

There is NO storage that keeps track of meta-data about orders.  When a trade
event happens (close, for example, due to take-profit) we only know about that
specific trade which may be part of a multi-order position:

    symbol: 'BITCOIN'
    open_price: 67458.03
    close_price: 66861.86
    position: 316522733
    comment: '[T/P]'
    profit: 59.62
    sl: 67206.15
    tp: 66863.15
    volume: 0.1

That's all the bot knows.  It doesn't know about the other orders (in the "family")
and their TP levels.  Instead the bot reasons about what to do solely from the single
trade event information that the server sends.

## Stop Loss

Once the bot is listening for trades it will spot orders closed because of _take
profit_ which will signal him to adjust the stop loss for all remaining orders in
the "family".

_A family is a group of orders all with the exact same stop loss._

### Break-even Stop Loss

When the first TP level is reached the stop loss moves to 0.03% better than the
open price.

### Trailing Stop Loss

When TP2 is reached the bot moves to halfway between the open-price and the
close-price for this order.

For example: Say we have three orders in a "family" all with a stop loss of `70239.44`:

    SL 70239.44 SELL BITCOIN TPs=[ 67133.03, 66998.09, 66863.15 ]

First we hit TP1:

    symbol     : 'BITCOIN'
    open_price : 67458.03
    close_price: 67122.13
    position   : 316522734
    comment    : '[T/P]'
    profit     : 33.59
    volume     : 0.1
    sl         : 70239.44
    tp         : 67133.03

The bot moves stop loss from `70239.44` to `67437.79 = 67458.03 - 20.24` for two
(2) orders.

Then we hit TP2:

    symbol     : 'BITCOIN'
    open_price : 67458.03
    close_price: 66994.74
    position   : 316522735
    comment    : '[T/P]'
    profit     : 46.33
    volume     : 0.1
    sl         :67437.79
    tp         :66998.09

The bot moves stop loss from
`67437.79` to `67206.15 = (67458.03 + 66994.74 / 2) - 20.24` for one (1) order.

Then TP3 (the last order) does not move any stop loss since there is noone left
in the family, perhaps sadly; but, don't get emotional.

## Documentation

xAPI <http://developers.xstore.pro/documentation/>

xapi-node <https://github.com/peterszombati/xapi-node#readme>

Telegram
* <https://github.com/gram-js/gramjs#readme>
* <https://painor.gitbook.io/gramjs/>
* <https://gram.js.org/>

## Installation

    git clone git@github.com:stav/xapi.git
    cd xapi
    pnpm install

### Configuration

Create a file called `config/local.yaml` with the following fields but with your
real information:

    Xapi:
        accountId: 12345
        password: xoh23456
        type: demo # or real

    Telegram:
        token: 34567:aAbBcC
        apiId: 45678
        apiHash: aA1bB2cC3
        session: ""
        Chats:
            - 56789
            - -10067890
        ChatParserMap:
            "-10067890": "name_of_parser_module"

## Usage

    $ pnpm x

    Socket is: DISCONNECTED

    "1" Connecting socket
    Socket is: CONNECTED

    "2" Connecting to Telegram
    [2021-12-05T16:59:35.348Z] [INFO] - [Running gramJS version 1.10.8]
    [2021-12-05T16:59:35.353Z] [INFO] - [Connecting to 52:80/TCPFull...]
    [2021-12-05T16:59:35.411Z] [INFO] - [Connection to 52:80/TCPFull complete!]
    Logged in as 123999885 Brandon (T0TALpipsmasher) 1AQAOMTQ5LjE1NC4...=
    Listening 11 [
    -1001399999100,
    1018999271
    ] { '-1001399999100': 'name_of_parser_module' }

    *. Order 313400349 SELL BITCOIN @ 61992.25 SL 62700 TP 61937.48 profit=-109.82

    "5" updateTrades 60300
    1. Order 312609755 SELL_STOP BITCOIN @ 60300 sl=60500
    2. Order 312609756 SELL_STOP BITCOIN @ 60300 sl=60500
    3. Order 312609757 SELL_STOP BITCOIN @ 60300 sl=60500
    Updated 3 trades with entry 60300 to new stop loss 60666
    1. Order 312609755 SELL_STOP BITCOIN @ 60300 sl=60666
    2. Order 312609756 SELL_STOP BITCOIN @ 60300 sl=60666
    3. Order 312609757 SELL_STOP BITCOIN @ 60300 sl=60666

    "6" Printing positions
    1. Order 313400349 SELL BITCOIN @ 61992.25 SL 62700 TP 61937.48
    2. Order 313402992 BUY BITCOIN @ 62200.81 SL 61000 TP 63200
    3. Order 313400348 SELL BITCOIN @ 61992.25 SL 62700 TP 61748.31
    4. Order 313402994 BUY BITCOIN @ 62200.81 SL 61000 TP 63300
    5. Order 313402993 BUY BITCOIN @ 62200.81 SL 61000 TP 62286.86

    "0" Print status
    Repository revision 0f36a6f
    Socket is: CONNECTED
    {
    Account: {
        type: 'demo',
        accountId: 12769999,
        appName: 'K1NGbot',
        host: 'ws.xtb.com',
        safe: false,
        subscribeTrades: true
    },
    WebSocket: 'wss://ws.xtb.com/demo',
    Session: '5cf3fcfffe78123a-...-15e6f90b',
    Message: Time { unit: [ 201664, 747189921 ], UTCTimestamp: 1638747645909 },
    XAPI: { version: '2.5.0' },
    KeepAlive: 2021-12-05T23:40:44.717Z,
    UTC_String: 'Sun, 05 Dec 2021 23:40:45 GMT',
    UTC_Date: 2021-12-05T23:40:45.910Z,
    Local: '12/5/2021, 6:40:45 PM'
    }

    "?" does nothing
    "0" Status
    "1" Connect_XA
    "2" Connect_Te
    "3" Trade_Tip
    "4" Trade_Prc
    "5" Update
    "6" Positions
    "9" Symbols
    "\u0003" Disconnect
    "\u0004" Disconnect

    "\u0004" Exit
    disconnecting... Socket is: DISCONNECTED
    [2021-11-24T05:40:06.283Z] [INFO] - [Disconnecting from 52:80/TCPFull...]
    [2021-11-24T05:40:06.285Z] [INFO] - [connection closed]

works with live socket at <https://xs5.xopenhub.pro/xoh>
