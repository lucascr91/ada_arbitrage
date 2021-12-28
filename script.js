let coinMb='ADA';
let coinBinance = 'ADABRL'
const methodMb = 'ticker';
let urlMb = `https://www.mercadobitcoin.net/api/${coinMb}/${methodMb}/`
let urlBinance = `https://api.binance.com/api/v3/trades?symbol=${coinBinance}`;

// update binance price
const updateBinance = (response) => {
    document.querySelector('.ada-binance').textContent = parseFloat(response[0]['price']).toFixed(2);
}
// update mb price
const updateMb = (response) => {
    document.querySelector('.ada-mb').textContent = parseFloat(response['ticker']['last']).toFixed(2);
}

const computeArbitrage = (binanceValue, mbValue) => {
    let result;
    if (binanceValue>mbValue) {
        result = ((binanceValue-mbValue)/binanceValue).toFixed(2)+"%";
    } else if (mbValue>binanceValue) {
        result = ((mbValue-binanceValue)/mbValue).toFixed(2)+"%";
    } else if (mbValue === binanceValue) {
        result = 0;
    }
    return result;
}

fetch(urlBinance)
    .then(res => res.json())
    .then((data) => updateBinance(data))
    .catch( (error) => console.log(error))

fetch(urlMb)
    .then(res => res.json())
    .then((data) => updateMb(data))
    .catch( (error) => console.log(error))


document.querySelector('.ada-binance').addEventListener('DOMSubtreeModified', () => {
    document.querySelector('.arb-gain').textContent = computeArbitrage(parseFloat(document.querySelector('.ada-binance').textContent),parseFloat(document.querySelector('.ada-mb').textContent));
    document.querySelector('.withdrawl-binance-cost').textContent = (1*parseFloat(document.querySelector('.ada-binance').textContent)).toFixed(2);
    document.querySelector('.withdrawl-mb-cost').textContent = (1*parseFloat(document.querySelector('.ada-mb').textContent)).toFixed(2);
    document.querySelector('.sell-mb-cost').textContent = (0.16*parseFloat(document.querySelector('.ada-mb').textContent)).toFixed(2);
    // document.querySelector('.sell-binance-cost').textContent = (0.1*parseFloat(document.querySelector('.ada-binance').textContent)).toFixed(2);
})

const computeGain = () => {
    let mbValue = document.querySelector('.ada-mb').textContent;
    let binanceValue = document.querySelector('.ada-binance').textContent;
    let investimento = document.querySelector('#form').textContent;
    console.log(investimento);
    let net;

    if (binanceValue>mbValue) {
        let gross = investimento*(binanceValue-mbValue);
        let transferCost = document.querySelector('.withdrawl-mb-cost').textContent;
        net = (gross-transferCost)*99.9;
    } else if (binanceValue<mbValue) {
        let gross = investimento*(mbValue-binanceValue);
        let transferCost = document.querySelector('.withdrawl-binance-cost').textContent;
        net = gross-transferCost - (0.16*mbValue);
    }
    document.querySelector('.result').textContent = net.toFixed(2);
}
