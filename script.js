let coinMb = "ADA";
let coinBinance = "ADABRL";
const methodMb = "ticker";
let urlMb = `https://www.mercadobitcoin.net/api/${coinMb}/${methodMb}/`;
let urlBinance = `https://api.binance.com/api/v3/trades?symbol=${coinBinance}`;

// update binance price
const updateBinance = (response) => {
  document.querySelector(".ada-binance").textContent = parseFloat(
    response[0]["price"]
  ).toFixed(2);
};
// update mb price
const updateMb = (response) => {
  document.querySelector(".ada-mb").textContent = parseFloat(
    response["ticker"]["last"]
  ).toFixed(2);
};

const computeArbitrage = (adaPriceBinance, adaPriceMb) => {
  let result;
  if (adaPriceBinance > adaPriceMb) {
    result =
      ((adaPriceBinance - adaPriceMb) / adaPriceBinance).toFixed(2) + "%";
  } else if (adaPriceMb > adaPriceBinance) {
    result = ((adaPriceMb - adaPriceBinance) / adaPriceMb).toFixed(2) + "%";
  } else if (adaPriceMb === adaPriceBinance) {
    result = 0;
  }
  return result;
};

fetch(urlBinance)
  .then((res) => res.json())
  .then((data) => updateBinance(data))
  .catch((error) => console.log(error));

fetch(urlMb)
  .then((res) => res.json())
  .then((data) => updateMb(data))
  .catch((error) => console.log(error));

document
  .querySelector(".ada-binance")
  .addEventListener("DOMSubtreeModified", () => {
    document.querySelector(".arb-gain").textContent = computeArbitrage(
      parseFloat(document.querySelector(".ada-binance").textContent),
      parseFloat(document.querySelector(".ada-mb").textContent)
    );
    document.querySelector(".withdrawl-binance-cost").textContent = (
      1 * parseFloat(document.querySelector(".ada-binance").textContent)
    ).toFixed(2);
    document.querySelector(".withdrawl-mb-cost").textContent = (
      1 * parseFloat(document.querySelector(".ada-mb").textContent)
    ).toFixed(2);
    document.querySelector(".sell-mb-cost").textContent = (
      0.16 * parseFloat(document.querySelector(".ada-mb").textContent)
    ).toFixed(2);
    // document.querySelector('.sell-binance-cost').textContent = (0.1*parseFloat(document.querySelector('.ada-binance').textContent)).toFixed(2);
  });

const computeGain = () => {
  let adaPriceBinance = parseFloat(
    document.querySelector(".ada-binance").textContent
  );
  let adaPriceMb = parseFloat(document.querySelector(".ada-mb").textContent);
  let investimentoRaw = document.querySelector("#currency-field").value;
  investimento = parseInt(
    investimentoRaw.split(" ")[1].split(".")[0].replace(",", "")
  );
  console.log(adaPriceBinance);
  console.log(adaPriceMb);
  console.log(investimento);
  let net;

  if (adaPriceBinance > adaPriceMb) {
    let adaQtdMb = investimento / adaPriceMb;
    // buy/sell cost
    adaQtdMb = adaQtdMb - 1.3;
    // transfer cost
    let adaQtdBinance = adaQtdMb - adaPriceMb;
    adaQtdBinance = adaQtdBinance * (1 - 0.001);
    let brlBinance = adaQtdBinance * adaPriceBinance;
    net = brlBinance - investimento;
  } else if (adaPriceBinance < adaPriceMb) {
    let adaQtdBinance = investimento / adaPriceBinance;
    // buy/sell cost
    adaQtdBinance = adaQtdBinance * (1 - 0.001);
    // transfer cost
    let adaQtdMb = adaQtdBinance - adaPriceBinance;
    let brlMb = adaQtdMb * adaPriceMb;
    net = brlMb - investimento;
  }
  document.querySelector(".result").textContent = net.toFixed(2);
};

// currency format
$("input[data-type='currency']").on({
  keyup: function () {
    formatCurrency($(this));
  },
  blur: function () {
    formatCurrency($(this), "blur");
  },
});

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatCurrency(input, blur) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  // get input value
  var input_val = input.val();

  // don't validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.prop("selectionStart");

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = "BRL " + left_side + "." + right_side;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = "BRL " + input_val;

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.val(input_val);

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
