import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Home.css";
import StockGraph from "./StockGraph";

function Home() {
  const [news, setNews] = useState([]); // Store live news articles
  const [loading, setLoading] = useState(true); // Handle loading state
  const newsRef = useRef(null); // Reference to the scrolling container

  // Fetch news every 24 hours and get news from the past week
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        // Get today's date and one week ago's date
        const today = new Date().toISOString().split("T")[0];
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const from = oneWeekAgo.toISOString().split("T")[0];

        // Fetch news within the date range
        const response = await axios.get(
          `https://newsapi.org/v2/everything?q=stock%20prices%20OR%20stocks%20OR%20"stock%20market"&from=${from}&to=${today}&sortBy=publishedAt&apiKey=ab44d0d9b4c74ac890b768fb39f647fc`
        );

        // Filter news articles based on keywords
        const filteredNews = response.data.articles.filter(
          (article) =>
            article.title.toLowerCase().includes("stock") ||
            article.title.toLowerCase().includes("price") ||
            article.description?.toLowerCase().includes("stock")
        );

        // Save the fetched news and current date to local storage
        localStorage.setItem("newsData", JSON.stringify(filteredNews));
        localStorage.setItem("fetchNewsDate", new Date().toISOString());

        setNews(filteredNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    // Check if news data is available in local storage and is valid
    const storedNews = JSON.parse(localStorage.getItem("newsData"));
    const fetchNewsDate = localStorage.getItem("fetchNewsDate");
    const currentTime = new Date().getTime();
    const fetchTime = new Date(fetchNewsDate).getTime();
    const hoursDifference = (currentTime - fetchTime) / (1000 * 60 * 60);

    if (storedNews && fetchNewsDate && hoursDifference < 24) {
      setNews(storedNews);
      setLoading(false);
      console.log("Using stored news data.");
    } else {
      fetchNews();
    }

    // Refresh the news feed every 24 hours
    const interval = setInterval(fetchNews, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Print the news to console for debugging
  useEffect(() => {
    console.log("Fetched News:", news); // Print the fetched news in the console
  }, [news]);

  // Scroll the content automatically from right to left
  useEffect(() => {
    if (newsRef.current && news.length > 0) {
      const scrollSpeed = 1; // Speed of the scroll (pixels per step)
      const intervalTime = 10; // Time in milliseconds between each scroll step

      const scrollContent = () => {
        if (newsRef.current) {
          const contentWidth = newsRef.current.scrollWidth; // Full width of content
          const containerWidth = newsRef.current.clientWidth; // Visible container width
          const maxScroll = contentWidth - containerWidth; // Max scroll distance

          // If the content has scrolled to the end, reset to the beginning
          if (newsRef.current.scrollLeft >= maxScroll) {
            newsRef.current.scrollLeft = 0; // Reset to the start
          } else {
            newsRef.current.scrollLeft += scrollSpeed; // Move by a fixed amount
          }
        }
      };

      // Start scrolling the content every `intervalTime` milliseconds
      const interval = setInterval(scrollContent, intervalTime);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [news]);

  // Embed TradingView widget script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      exchange: "US",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: false,
      showFloatingTooltip: false,
      width: "400",
      height: "550",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(42, 46, 57, 0)",
      scaleFontColor: "rgba(209, 212, 220, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
    });

    const tradingViewWidgetContainer = document.getElementById(
      "tradingview-widget-container"
    );
    tradingViewWidgetContainer.appendChild(script);

    return () => {
      tradingViewWidgetContainer.removeChild(script);
    };
  }, []);

  return (
    <section>
      <div className="GraphsTab">
        {/* Displaying the StockGraph component */}
        <h3>Famous Stocks</h3>
        <StockGraph /> {/* Render the StockGraph component here */}
      </div>

      {/* NewsTab */}
      <div className="NewsTab">
        {loading && news.length === 0 ? (
          <div style={{ color: "white" }}>Loading...</div>
        ) : news.length === 0 ? (
          <div style={{ color: "white" }}>
            API limit reached or data not found
          </div>
        ) : (
          <div
            className="news-text"
            ref={newsRef}
            style={{ overflowX: "hidden", whiteSpace: "nowrap" }}
          >
            {/* Append news array for seamless scrolling */}
            {[...news, ...news].map((article, index) => (
              <span
                key={index}
                className="news-item"
                style={{ display: "inline-block", paddingRight: "30px" }}
              >
                {/* Display article title followed by description, separated by a hyphen */}
                <strong>{article.title}</strong> - {article.description} |{" "}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        id="tradingview-widget-container"
        className="tradingview-widget-container"
      >
        <div className="tradingview-widget-container__widget"></div>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Home;
