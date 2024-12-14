import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const StockGraphs = () => {
  const [chartData, setChartData] = useState([]);
  const apiKey = "E8VHF69MGJTOMQ53"; // Replace with your API key for Alpha Vantage

  useEffect(() => {
    const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN"]; // List of stock symbols
    const fetchDate = localStorage.getItem("fetchDate");
    const storedChartData = JSON.parse(localStorage.getItem("chartData"));

    // Check if data is still valid (within 24 hours)
    if (fetchDate && storedChartData) {
      const currentTime = new Date().getTime();
      const fetchTime = new Date(fetchDate).getTime();
      const hoursDifference = (currentTime - fetchTime) / (1000 * 60 * 60);

      if (hoursDifference < 24) {
        setChartData(storedChartData);
        console.log("Using stored data.");
        return;
      }
    }

    const fetchData = async () => {
      const newChartData = []; // Store data for all symbols

      for (const symbol of symbols) {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
        );
        const data = await response.json();

        // Check for the error message in the response
        if (data.Information) {
          console.error("API Limit Exceeded:", data.Information);
          return;
        }

        // Process the data if available for the current symbol
        if (data["Time Series (Daily)"]) {
          const timeSeries = data["Time Series (Daily)"];
          const dates = Object.keys(timeSeries).reverse();
          const closingPrices = dates.map(
            (date) => timeSeries[date]["4. close"]
          );

          const chartSymbolData = {
            labels: dates,
            datasets: [
              {
                label: `${symbol} Stock Price`,
                data: closingPrices,
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
              },
            ],
          };

          newChartData.push({ symbol, data: chartSymbolData });
        } else {
          console.error(`No valid data found for the symbol: ${symbol}`);
        }
      }

      // Update state with the new data and store the fetch date and data in local storage
      setChartData(newChartData);
      localStorage.setItem("chartData", JSON.stringify(newChartData));
      localStorage.setItem("fetchDate", new Date().toISOString()); // Store current date and time
    };

    fetchData();
  }, []); // Empty dependency array means this useEffect runs only once when the component mounts

  return (
    <div>
      <h1>Stock Prices</h1>
      {chartData.length === 0 ? (
        <p>Loading charts...</p>
      ) : (
        chartData.map((chart, index) => (
          <div key={index}>
            <h3>{chart.symbol} Stock Price</h3>
            <Line data={chart.data} />
          </div>
        ))
      )}
    </div>
  );
};

export default StockGraphs;
