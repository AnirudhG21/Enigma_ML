import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import Home from "./Home";
import About from "./About";
import Dashboard from "./Dashboard";
import CookieConsent from "./CookieConsent";
import "font-awesome/css/font-awesome.min.css";


function App() {
  const [imageSrc, setImageSrc] = useState('');
  const [activeSection, setActiveSection] = useState("home");

  const fetchGraph = async () => {
    const yourInputData = {
      data: [
        {
          open: 120.50,
          high: 125.00,
          low: 119.00,
          close: 123.45,
          volume: 1500000,
          "5_day_ma": 122.30,
          "10_day_ma": 121.50,
          "20_day_ma": 120.75,
          rsi: 55.6,
          macd: 0.45
        }
      ]
    };

    try {
      const response = await fetch('http://localhost:3000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(yourInputData), // Replace with your actual input data
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      } else {
        console.error('Failed to fetch graph');
      }
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      let currentSection = "home";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="App">
      <h1>Model Predictions</h1>
      <button onClick={fetchGraph}>Fetch Graph</button>
      {imageSrc && <img src={imageSrc} alt="Model Predictions" />}

      {/* Pass activeSection to NavBar */}
      <NavBar activeSection={activeSection} />

      {/* Scrollable Sections */}
      <div id="home" className="section">
        <Home />
      </div>
      <div id="dashboard" className="section">
        <Dashboard />
      </div>
      <div id="about" className="section">
        <About />
      </div>

      {/* Footer or CookieConsent */}
      <CookieConsent />
    </div>
  );
}

export default App;
