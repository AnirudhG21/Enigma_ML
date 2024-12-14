import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import Login from "./Login"; // Import the Login modal component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [activeSection, setActiveSection] = useState("home"); // State for active section
  const [showSearch, setShowSearch] = useState(false); // State for search bar visibility
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Index of the current word in the list
  const wordList = ["Portfolio", "Company", "Stocks", "Market"]; // List of words

  const searchRef = useRef(null); // Reference to search bar container
  const searchInputRef = useRef(null); // Reference to search input

  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev); // Toggle search bar visibility
  };

  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to the section
    }
  };

  // Detect clicks outside the search bar to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) && // Check if the click is outside the search bar
        !searchInputRef.current.contains(event.target) // Check if the click is outside the search input
      ) {
        setShowSearch(false); // Close search bar when clicked outside
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll(".section");
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.6, // Trigger when 60% of the section is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Update active section
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      observer.observe(section); // Observe each section
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section)); // Cleanup observer
    };
  }, []);

  // Cycle through words every 2 seconds
  useEffect(() => {
    const wordCycleInterval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % wordList.length);
    }, 750); // Change word every 2 seconds

    return () => clearInterval(wordCycleInterval);
  }, [wordList.length]);

  return (
    <>
      <div className="navbar-container">
        <div
          className={`Logo-Image ${activeSection === "home" ? "fade-out" : ""}`}
          onClick={() => {
            scrollToSection("home");
          }}
        >
          <img src="/Assets/Img/Logo.png" alt="Logo" />
        </div>

        {/* Search Bar */}
        <div className="search-container" ref={searchRef}>
          <i
            className="fa fa-search search-icon"
            onClick={toggleSearch}
            aria-hidden="true"
          ></i>
          <input
            ref={searchInputRef}
            type="text"
            placeholder={`Search for ${wordList[currentWordIndex]}`}
            className={`search-bar ${showSearch ? "visible" : ""}`}
          />
        </div>

        {/* Login Button */}
        <button className="right-align" onClick={toggleModal}>
          LOGIN
        </button>
      </div>

      {/* Sidebar Navigation */}
      <div className="sidebar">
        <nav>
          <button
            onClick={() => scrollToSection("home")}
            className={activeSection === "home" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faHome} className="nav-icon" />
            HOME
          </button>
          <button
            onClick={() => scrollToSection("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faTachometerAlt} className="nav-icon" />
            DASHBOARD
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className={activeSection === "about" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
            ABOUT
          </button>
        </nav>
      </div>

      {/* Conditionally render the Login modal */}
      {showModal && <Login closeModal={toggleModal} />}
    </>
  );
}

export default NavBar;
