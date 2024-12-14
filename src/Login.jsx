import React, { useState } from "react";
import "./Login.css";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";

function Login({ closeModal }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [text, setUser] = useState("");
  const [signemail, setsignEmail] = useState("");
  const [signpassword, setsignPassword] = useState("");
  const [signpasswordVisible, setsignPasswordVisible] = useState(false);
  const [confirmpassword, confirmsetPassword] = useState("");
  const [confirmpasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  const toggleModal = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      setIsTransitioning(false);
    }, 500);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    console.log("Form Submitted", { email, password });
  };

  return (
    <div className="glassmorphic-overlay show">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="close-btn" onClick={closeModal}>
          X
        </button>
        <div className="Logo-Image-Modal">
          <img src="/Assets/Img/Logo.png" alt="Logo" />
        </div>
        <div className={isTransitioning ? "fade-out" : "fade-in"}>
          {isSignUp ? (
            <SignUpModal
              text={text}
              setUser={setUser}
              signemail={signemail}
              setsignEmail={setsignEmail}
              signpassword={signpassword}
              setsignPassword={setsignPassword}
              signpasswordVisible={signpasswordVisible}
              setsignPasswordVisible={setsignPasswordVisible}
              confirmpassword={confirmpassword}
              confirmsetPassword={confirmsetPassword}
              confirmpasswordVisible={confirmpasswordVisible}
              setConfirmPasswordVisible={setConfirmPasswordVisible}
              error={error}
              handleLoginSubmit={handleLoginSubmit}
              toggleModal={toggleModal}
            />
          ) : (
            <LoginModal
              email={email}
              password={password}
              passwordVisible={passwordVisible}
              setEmail={setEmail}
              setPassword={setPassword}
              setPasswordVisible={setPasswordVisible}
              error={error}
              handleLoginSubmit={handleLoginSubmit}
              toggleModal={toggleModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
