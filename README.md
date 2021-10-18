The bot is a NodeJS command line application that has, through the `config.default.yaml`
file, the ability to open a multi-order position on XTB's XStation 5 appliance.
It can listen for when trade events take place via a websocket connection.

### Coming Enhancements

Once the bot is listening for trades it will spot orders closed because of take
profit which will signal the bot to adjust the stop loss for all remaining orders.

## Installation

	git clone git@github.com:stav/xapi.git
	cd xapi
	pnpm install

## Usage

	$ pnpm tsc && node dist/src/index.js

	Socket is: CONNECTED
	"1" Listening for trades
	{"cmd":3,"order":311313788,"digits":2,"offset":0,"order2":311313788,"position":
	311313788,"symbol":"GOLD","comment":"","customComment":"x163456025517000050_K1NGbot",
	"commission":0,"storage":0,"margin_rate":0,"close_price":0,"open_price":1765,
	"nominalValue":0,"profit":null,"volume":10,"sl":1775,"tp":1763,"closed":false,
	"type":1,"open_time":1634560255319,"close_time":null,"expiration":1666096249983,
	"state":"Modified"}

	"6" does nothing
	"1" listenForTrades
	"2" unListenForTrades
	"3" buySellGold
	"4" writeAllSymbols
	"5" updateStoploss
	"\u0003" disconnect
	"\u0004" disconnect

	"2" No longer listening for trades
	"\u0004" disconnecting... DISCONNECTED

works with live (demo) socket at https://xs5.xopenhub.pro/xoh

	{
		"symbol": "GOLD",
		"currency": "USD",
		"categoryName": "CMD",
		"currencyProfit": "USD",
		"quoteId": 10,
		"quoteIdCross": 4,
		"marginMode": 102,
		"profitMode": 6,
		"pipsPrecision": 0,
		"contractSize": 100,
		"exemode": 1,
		"time": 1633654532765,
		"expiration": null,
		"stopsLevel": 0,
		"precision": 2,
		"swapType": 1,
		"stepRuleId": 3,
		"type": 383,
		"instantMaxVolume": 2147483647,
		"groupName": "Precious Metals",
		"description": "Quotations of troy ounce of Gold on the interbank market.",
		"longOnly": false,
		"trailingEnabled": true,
		"marginHedgedStrong": false,
		"swapEnable": true,
		"percentage": 100.0,
		"bid": 1756.05,
		"ask": 1756.09,
		"high": 1756.41,
		"low": 1753.40,
		"lotMin": 0.01,
		"lotMax": 100.00,
		"lotStep": 0.01,
		"tickSize": 0.01,
		"tickValue": 1.00,
		"swapLong": -7.714189,
		"swapShort": -6.910087,
		"leverage": 1.00,
		"spreadRaw": 0.04,
		"spreadTable": 0.04,
		"starting": null,
		"swap_rollover3days": 0,
		"marginMaintenance": 0,
		"marginHedged": 0,
		"initialMargin": 0,
		"shortSelling": true,
		"currencyPair": false,
		"timeString": "Fri Oct 08 02:55:32 CEST 2021"
	}

Format of SYMBOL_RECORD:

Please be advised that result values for profit and margin calculation can be used optionally, because server is able to perform all profit/margin calculations for Client application by commands described later in this document.

	NAME                TYPE       DESCRIPTION

	ask                 Floating   number Ask price in base currency
	bid                 Floating   number Bid price in base currency
	categoryName        String     Category name
	contractSize        Number     Size of 1 lot
	currency            String     Currency
	currencyPair        Boolean    Indicates whether the symbol represents a currency pair
	currencyProfit      String     The currency of calculated profit
	description         String     Description
	expiration          Time       Null if not applicable
	groupName           String     Symbol group name
	high                Floating   number The highest price of the day in base currency
	initialMargin       Number     Initial margin for 1 lot order, used for profit/margin calculation
	instantMaxVolume    Number     Maximum instant volume multiplied by 100 (in lots)
	leverage            Floating   number Symbol leverage
	longOnly            Boolean    Long only
	lotMax              Floating   number Maximum size of trade
	lotMin              Floating   number Minimum size of trade
	lotStep             Floating   number A value of minimum step by which the size of trade can be changed (within lotMin - lotMax range)
	low                 Floating   number The lowest price of the day in base currency
	marginHedged        Number     Used for profit calculation
	marginHedgedStrong  Boolean    For margin calculation
	marginMaintenance   Number     For margin calculation, null if not applicable
	marginMode          Number     For margin calculation
	percentage          Floating   number Percentage
	pipsPrecision       Number     Number of symbol's pip decimal places
	precision           Number     Number of symbol's price decimal places
	profitMode          Number     For profit calculation
	quoteId             Number     Source of price
	shortSelling        Boolean    Indicates whether short selling is allowed on the instrument
	spreadRaw           Floating   number The difference between raw ask and bid prices
	spreadTable         Floating   number Spread representation
	starting            Time       Null if not applicable
	stepRuleId          Number     Appropriate step rule ID from getStepRules command response
	stopsLevel          Number     Minimal distance (in pips) from the current price where the stopLoss/takeProfit can be set
	swap_rollover3days  Number     Time when additional swap is accounted for weekend
	swapEnable          Boolean    Indicates whether swap value is added to position on end of day
	swapLong            Floating   number Swap value for long positions in pips
	swapShort           Floating   number Swap value for short positions in pips
	swapType            Number     Type of swap calculated
	symbol              String     Symbol name
	tickSize            Floating   number Smallest possible price change, used for profit/margin calculation, null if not applicable
	tickValue           Floating   number Value of smallest possible price change (in base currency), used for profit/margin calculation, null if not applicable
	time                Time       Ask & bid tick time
	timeString          String     Time in String
	trailingEnabled     Boolean    Indicates whether trailing stop (offset) is applicable to the instrument.
	type                Number     Instrument class number
