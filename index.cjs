//import prompt-sync node module//
const prompt = require('prompt-sync')();
const Binance = require('node-binance-api');
//import dotenv to configure .env file//
const dotenv = require('dotenv');
dotenv.config();

//get user input and convert the luno price in MYR//
async function getLunoTicketinMYR(currency){

    let currencyformat;
    if(currency === "BTC"){
      currencyformat ="XBT"
    }else{
      currencyformat = currency
    }

    const lunoRes = await fetch(`https://api.luno.com/api/1/ticker?pair=${currencyformat}MYR`);
    const LunoMYR = await lunoRes.json();
    return LunoMYR.last_trade;
}

async function getBinanceUSD(currency){
    const binance = new Binance()
    const ticker = await binance.prices(`${currency}BUSD`);
    return ticker[`${currency}BUSD`];
}
  // get exchange rate from user input to MYR//
  async function getExchangeRates() {
    var myHeaders = new Headers();
    myHeaders.append("apikey", process.env.APILAYER_KEY);
    var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
    };
  
  const apiUrl = `https://api.apilayer.com/fixer/latest?base=USD&symbols=MYR`;
  
    try {
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      const myrRate = data.rates.MYR;
      return myrRate;
    } catch (error) {
      console.error(error);
    }
  }

//print out the luno price in MYR//
async function calculateLunoPremium(){
    const currencyData = prompt('Enter your desired cyrptocurrency e.g.BTC : ' )
    const currency = currencyData.toUpperCase();
    
    const LunoPriceMYR = await getLunoTicketinMYR(currency);
    console.log( `${currency}MYR price on Luno:` .padEnd(30) + "MYR" + " " + LunoPriceMYR );

    const exchange = await getExchangeRates();
    console.log( `USDMYR : ` .padEnd(30) + exchange );

    const lunoUSD = LunoPriceMYR / exchange
    console.log( `${currency}USD price on Luno : ` .padEnd(30) + "USD" + " " + lunoUSD);

    const binanceUSD = await getBinanceUSD(currency);
    console.log( `${currency}BUSD price on BINANCE : ` .padEnd(30) + "USD" + " " + binanceUSD );

    const diff = lunoUSD - binanceUSD
    console.log( `Price difference: ` .padEnd(30) + "USD" + " " + diff );

    const lunoPremium = diff / lunoUSD * 100
    console.log( `Luno premium for ${currency}: ` .padEnd(30) + lunoPremium.toFixed(2) + "%" );
}

calculateLunoPremium()
