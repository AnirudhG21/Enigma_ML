import React, { useState, useEffect } from "react";
import "./Dashboard.css";

function Dashboard() {
  // State to manage preferences and modal visibility
  const [symbol, setSymbol] = useState(""); // Default stock symbol is empty
  const [showPreferences, setShowPreferences] = useState(true); // Control preferences visibility

  // Handler for input change
  const handleSymbolChange = (e) => setSymbol(e.target.value);

  // Handle form submission to apply filters and hide the input
  const handleApplyFilters = (e) => {
    e.preventDefault();
    setShowPreferences(false); // Hide the input box after submission
  };

  // Embed TradingView widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
        { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      ],
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    const container = document.getElementById(
      "tradingview-widget-container-updated"
    );
    if (container) {
      container.appendChild(script);
    }

    return () => {
      if (container) {
        container.innerHTML = ""; // Clear the container to remove the script
      }
    };
  }, []);

  return (
    <section className="dashboard">
      {showPreferences ? (
        <div className="preferences">
          <h1 className="preferences-heading">Enter Stock Symbol</h1>
          <form className="preferences-form" onSubmit={handleApplyFilters}>
            <div className="form-group">
              <label htmlFor="symbol" className="form-label">
                Stock Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={handleSymbolChange}
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="form-button">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <div className="graphs-display">
          <h1 className="graphs-heading">DISPLAYING GRAPHS FOR {symbol}</h1>
          {/* Here you can generate graphs based on the entered symbol */}
        </div>
      )}
      <div className="tradingview-container-updated">
        <div
          id="tradingview-widget-container-updated"
          className="tradingview-widget-container-updated"
        >
          <div className="tradingview-widget-container__widget-updated"></div>
          <div className="tradingview-widget-copyright-updated">
            <a
              href="https://www.tradingview.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              {" "}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
