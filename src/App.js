import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Background from "./assets/images/converter-bg.jpg";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const API_KEY = process.env.REACT_APP_API_KEY;

const App = () => {
  const [amount, setAmount] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [rates, setRates] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [result, setResult] = useState(null);

  const eurosInput = useRef(null);

  const formatedAmount = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

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
          const calculatedResult = amount * currencyRate.rate;

          const formatedResult = new Intl.NumberFormat({
            style: "currency",
            currency: selectedCurrency,
          }).format(calculatedResult);

          setResult(formatedResult);
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
          <button onClick={() => eurosInput.current.focus()}>Let's go</button>
        </div>
        <div className="converter">
          <h2>How to convert your euros into another currency</h2>
          <p className="subtitle">
            Enter the amount of euros you want to convert, and choose the
            currency you want. We do the conversion and serve it to you on a
            silver platter, instantly.
          </p>
          <div className="form-wrapper">
            <TextField
              inputRef={eurosInput}
              label="Euros"
              name="amount"
              type="number"
              placeholder="Amount in euros"
              InputLabelProps={{
                shrink: true,
              }}
              value={amount || ""}
              onChange={handleChange}
              variant="outlined"
            />
            <FormControl variant="outlined">
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                label="Currency"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {currencies &&
                  currencies.map((currency, index) => {
                    return (
                      <MenuItem
                        key={index}
                        value={currency.symbol}
                      >{`${currency.symbol} - ${currency.name}`}</MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>
          {result ? (
            <p className="result">{`${formatedAmount} = ${result} ${selectedCurrency}`}</p>
          ) : (
            <p className="result">Your result will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
