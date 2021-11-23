# K1NGBOT

The bot is a NodeJS command line application that has, through the `config.default.yaml`
file, the ability to open a multi-order position on XTB's XStation 5 appliance.
It can listen for when trade events take place via a websocket connection.

The bot runs state-less, which means that there is NO database that keeps track
of meta-data about orders.  In other words when a TP level is reached, the server
sends information about the trade:

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
and their TP levels.  Instead the bot reasons about what to do solely from the trade
event information that the server sends.

## Stop Loss

Once the bot is listening for trades it will spot orders closed because of take
profit which will signal the bot to adjust the stop loss for all remaining orders
in the "family".

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

Then TP3 (the last order) does not move any stop loss.

## Documentation

<http://developers.xstore.pro/documentation/>

## Installation

    git clone git@github.com:stav/xapi.git
    cd xapi
    pnpm install

## Usage

    $ pnpm tsc && node dist/index.js

    Socket is: DISCONNECTED

    "1" Connecting socket
    Socket is: CONNECTED

    "2" Connecting Telegram
    [2021-11-24T05:21:21.550Z] [INFO] - [Running gramJS version 1.10.8]
    [2021-11-24T05:21:21.552Z] [INFO] - [Connecting to 149.154.175.52:80/TCPFull...]
    [2021-11-24T05:21:21.608Z] [INFO] - [Connection to 149.154.175.52:80/TCPFull complete!]
    Logged in as 12345 Brandon (PipsJammer)
    Listening 11 [ 23456, -10034567 ] -10034567

    *. Order 313400349 313384466 313400349 SELL BITCOIN @ 61992.25 SL 62700 TP 61937.48 profit=-109.82

    "5" updateTrades 60300
    1. Order 312609755 312609755 312609755 SELL_STOP BITCOIN @ 60300 sl=60500
    2. Order 312609756 312609756 312609756 SELL_STOP BITCOIN @ 60300 sl=60500
    3. Order 312609757 312609757 312609757 SELL_STOP BITCOIN @ 60300 sl=60500
    Updated 3 trades with entry 60300 to new stop loss 60666
    1. Order 312609755 312609755 312609755 SELL_STOP BITCOIN @ 60300 sl=60666
    2. Order 312609756 312609756 312609756 SELL_STOP BITCOIN @ 60300 sl=60666
    3. Order 312609757 312609757 312609757 SELL_STOP BITCOIN @ 60300 sl=60666

    "6" Printing positions
    1. Order 313400349 313384466 313400349 SELL BITCOIN @ 61992.25 SL 62700 TP 61937.48
    2. Order 313402992 313401742 313402992 BUY BITCOIN @ 62200.81 SL 61000 TP 63200
    3. Order 313400348 313384467 313400348 SELL BITCOIN @ 61992.25 SL 62700 TP 61748.31
    4. Order 313402994 313401744 313402994 BUY BITCOIN @ 62200.81 SL 61000 TP 63300
    5. Order 313402993 313401741 313402993 BUY BITCOIN @ 62200.81 SL 61000 TP 62286.86

    "?" does nothing
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
    [2021-11-24T05:40:06.283Z] [INFO] - [Disconnecting from 149.154.175.52:80/TCPFull...]
    [2021-11-24T05:40:06.285Z] [INFO] - [connection closed]

works with live socket at <https://xs5.xopenhub.pro/xoh>
