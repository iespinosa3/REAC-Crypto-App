import "./styles.css";
import { useState, useEffect } from "react";
import SearchInput from "./SearchInput";

// Use this API
// https://binance.us/api/v3/ticker/24hr
//'https://dummyjson.com/products/1'
// symbols we want...
// BTCUSDT  BTCUSD4(Bitcoin)
// ETHUSDT ETHUSD4(Ethereum)
// SOLUSDT SOLUSD4(Solana)
// ADAUSDT ADAUSD4(Cardano)
// DOGEUSDT DOGEUSD4(DogeCoin)

export default function App() {
  const [inputValue, setInputValue] = useState("");
  const [symbols, setSymbols] = useState("");
  const [symbolNames, setSymbolNames] = useState([]);
  const [symbolPrices, setSymbolPrices] = useState([]);
  const [symbolPercentages, setSymbolPercentages] = useState([]);
  const [symbolPrevClosePrice, setSymbolPrevClosePrice] = useState([]);

  // 1. STATE AND USEEFFECT HERE
  //------------------------------------------------------------------
  // create useEffect to moniter change in the (symbols variable)
  useEffect(() => {
    fetch("https://binance.us/api/v3/ticker/24hr")
      .then((res) => res.json())
      .then((data) => {
        setSymbols(data);
      });
  }, [symbols]);

  // 3. ...and then store them in state?
  function CreateSearch() {
    for (var s in symbols) {
      if (symbols[s].symbol === inputValue) {
        setSymbolNames((current) => [...current, symbols[s].symbol]);
        setSymbolPrices((current) => [...current, symbols[s].lastPrice]);
        setSymbolPercentages((current) => [
          ...current,
          symbols[s].priceChangePercent
        ]);
        setSymbolPrevClosePrice((current) => [
          ...current,
          symbols[s].prevClosePrice
        ]);

        break;
      } else {
        console.log("error");
      }
    }
  }

  function MarketCondition({ index }) {
    if (Number(symbolPercentages[index]) > 0) {
      return (
        <td
          className="day-percentage"
          style={{ color: "green", display: "block" }}
        >
          {symbolPercentages[index]} ▲
        </td>
      ); //<>▲</>;
    } else if (Number(symbolPercentages[index]) < 0) {
      return (
        <td
          className="day-percentage"
          style={{ color: "red", display: "block" }}
        >
          {symbolPercentages[index]} ▼
        </td>
      ); //<>▼</>;
    }
  }

  // create table dynamically
  //--------------------------------------------------------------------
  let rowCreate = symbolNames.length; // create table rows
  const tableData = 1; // create table data

  console.log(symbolNames.length);

  const column = Array.from({ length: tableData }, (_, index) => (
    <td key={index} className="symbol-#">
      {index}
    </td>
  ));

  const rows = Array.from({ length: rowCreate }, (_, index) => (
    <tr
      key={index}
      className="custom-tr"
      style={{ backgroundColor: "white", width: "100%", height: "10px" }}
    >
      <td> {index + 1}</td>
      <td> {symbolNames[index]}</td>
      <td> ${Number(symbolPrices[index]).toLocaleString()}</td>
      <MarketCondition index={index} />
      <td>
        <RemoveButton index={index} />
      </td>
    </tr>
  ));

  //rest contents of the array
  //-------------------------------------------------------------------
  function RestSearch() {
    for (var s in symbolNames) {
      if (symbolNames.length > 0) {
        setSymbolNames((symbolNames[s] = ""));
        setSymbolPrices((symbolPrices[s] = ""));
        setSymbolPercentages((symbolPercentages[s] = ""));
        setSymbolPrevClosePrice((symbolPrevClosePrice[s] = ""));
      }
    }
  }
  console.log(symbolNames);
  //-------------------------------------------------------------------
  // remove row function
  const remover = (index) => {
    const updateSymbolName = symbolNames.filter((_, index) => index);
    const updateSymbolPrices = symbolPrices.filter((_, index) => index);
    const updateSymbolPercentages = symbolPercentages.filter(
      (_, index) => index
    );
    const updateSymbolPrevClosePrice = symbolPrevClosePrice.filter(
      (_, index) => index
    );
    setSymbolNames(updateSymbolName);
    setSymbolPrices(updateSymbolPrices);
    setSymbolPercentages(updateSymbolPercentages);
    setSymbolPrevClosePrice(updateSymbolPrevClosePrice);
  };

  //-------------------------------------------------------------------
  // remove row
  function RemoveButton({ index }) {
    return (
      <button className="btn-remove" onClick={remover}>
        Remove
      </button>
    );
  }

  //-------------------------------------------------------------------
  return (
    <div className="App">
      <nav>
        <img
          alt="logo"
          src="https://assets.codepen.io/6060109/crypto-logo-secondary.png"
        />

        <SearchInput inputValue={inputValue} setInputValue={setInputValue} />
        <button className="btn-search" onClick={CreateSearch}>
          Search
        </button>
        <button className="btn-search" onClick={RestSearch}>
          Reset
        </button>
      </nav>
      <div className="main-content">
        <h2>Today's cryptocurrency prices</h2>
        <table>
          <tbody>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Price</th>
              <th>24h %</th>
            </tr>

            {/* Up? Green + ▲ */}
            {/* Down? Red + ▼ */}

            {rows}
          </tbody>
        </table>

        <div className="bottom-logo-ctr">
          <img
            className="bottom-logo"
            alt="logo"
            src="https://assets.codepen.io/6060109/crypto-logo-primary.png"
          />
        </div>
      </div>
    </div>
  );
}
