import React, { useState, useEffect, useRef } from "react";
import "./CookieConsent.css"; // Add your own styling

function CookieConsent() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null); // Reference to the modal container

  useEffect(() => {
    // Check if the user has already given consent by looking at the cookie
    const cookieConsent = document.cookie
      .split("; ")
      .find((row) => row.startsWith("cookieConsentNirvana="));

    if (!cookieConsent) {
      setShowModal(true); // Show modal if no cookieConsent is found
    }

    // Add event listener to handle click outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        rejectCookies(); // Reject cookies and close the modal when clicked outside
      }
    };

    // Attach event listener
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const acceptCookies = () => {
    // Set a cookie with a 1-year expiration date when accepted
    document.cookie =
      "cookieConsentNirvana=accepted; path=/; max-age=" + 60 * 60 * 24 * 30;
    setShowModal(false);
  };

  const rejectCookies = () => {
    // Set a cookie to indicate rejection (with an immediate expiry)
    document.cookie = "cookieConsentNirvana=rejected; path=/; max-age=0";
    setShowModal(false);
  };

  return (
    showModal && (
      <div className="cookie-consent-modal" ref={modalRef}>
        <div className="cookie-consent-content">
          <p>Our Cookies tastes great and ensures a smooth experience!</p>
          <button className="accept" onClick={acceptCookies}>
            Accept
          </button>
          <button className="reject" onClick={rejectCookies}>
            Reject
          </button>
        </div>
      </div>
    )
  );
}

export default CookieConsent;
