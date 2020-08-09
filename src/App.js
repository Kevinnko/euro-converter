import React from "react";
import "./App.css";
import Background from "./assets/images/converter-bg.jpg";

const App = () => {
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
          <h2>How to convert your euros into antoher currency</h2>
          <p className="subtitle">
            Enter the amount of euros you want to convert, and choose the
            currency you want. We do the conversion and serve it to you on a
            silver platter, instantly.
          </p>
          <div className="form-wrapper">
            <input
              type="number"
              name="euros"
              placeholder="Enter here your amount in euros"
            />
            <select>
              <option selected value="coconut">
                Noix de coco
              </option>
              <option value="mango">Mangue</option>
            </select>
          </div>
          <p className="result">Your result will appear here ;)</p>
        </div>
      </div>
    </div>
  );
};

export default App;
