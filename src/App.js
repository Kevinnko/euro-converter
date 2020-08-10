import React, { useState, useEffect } from "react";
import "./App.css";
import Background from "./assets/images/converter-bg.jpg";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [amount, setAmount] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const currentValue = e.target.value;
    setAmount(currentValue);
    if (!currentValue) {
      setResult(null);
    }
  };

  const getCurrencies = async () => {
    const currenciesArray = [];
    try {
      const res = await axios.get(
        `http://data.fixer.io/api/symbols?access_key=${API_KEY}`
      );
      const { success, symbols } = res.data;
      if (success) {
        // Put received currencies in an array
        for (const [key, value] of Object.entries(symbols)) {
          currenciesArray.push({ symbol: key, name: value });
        }
        setCurrencies(currenciesArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getRates = async () => {
    const ratesArray = [];
    try {
      const res = await axios.get(
        `http://data.fixer.io/api/latest?access_key=${API_KEY}&base=EUR`
      );
      const { success, rates } = res.data;
      if (success) {
        for (const [key, value] of Object.entries(rates)) {
          ratesArray.push({ symbol: key, rate: value });
        }
        setRates(ratesArray);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // Get all available currencies and rates
    getCurrencies();
    getRates();
  }, []);

  useEffect(() => {
    const convert = () => {
      if (rates.length > 0) {
        const currencyRate = rates.find(
          (rate) => rate.symbol === selectedCurrency
        );
        if (amount && currencyRate) {
          const calculatedResult = (amount * currencyRate.rate).toFixed(4);
          setResult(calculatedResult);
        }
      }
    };
    convert();
  }, [amount, selectedCurrency, rates]);

  return (
    <div
      className="container"
      style={{ backgroundImage: `url(${Background})` }}
    >
      <div className="content-wrapper">
        <div className="left-wrapper">
          <h1>
            Stunning
            <br /> €uro converter
          </h1>
          <p className="subtitle">
            Convert euros in the currency of your choice in no time. It’s easy,
            it’s free, and it’s based on real-time exchange rate for 170 world
            currencies.
          </p>
          <button>Let's go</button>
        </div>
        <div className="converter">
          <h2>How to convert your euros into another currency</h2>
          <p className="subtitle">
            Enter the amount of euros you want to convert, and choose the
            currency you want. We do the conversion and serve it to you on a
            silver platter, instantly.
          </p>
          <div className="form-wrapper">
            <input
              type="number"
              name="amount"
              placeholder="Enter here your amount in euros"
              value={amount || ""}
              onChange={handleChange}
            />
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <option value="" disabled>
                Select your option
              </option>
              {currencies &&
                currencies.map((currency, index) => {
                  return (
                    <option key={index} value={currency.symbol}>
                      {`${currency.symbol} - ${currency.name}`}
                    </option>
                  );
                })}
            </select>
          </div>
          {result ? (
            <p className="result">{`${amount} EUR  = ${result} ${selectedCurrency}`}</p>
          ) : (
            <p className="result">Your result will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
