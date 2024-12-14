import React from "react";

const SignUpModal = ({
  text,
  setUser,
  signemail,
  setsignEmail,
  signpassword,
  setsignPassword,
  signpasswordVisible,
  setsignPasswordVisible,
  confirmpassword,
  confirmsetPassword,
  confirmpasswordVisible,
  setConfirmPasswordVisible,
  error,
  handleLoginSubmit,
  toggleModal,
}) => {
  return (
    <div className="modal-content">
      <h1>SIGN-UP</h1>
      <p>Welcome! Please sign up to continue.</p>
      <form onSubmit={handleLoginSubmit}>
        <div className="input-container user">
          <input
            type="text"
            placeholder="User Name"
            value={text}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            value={signemail}
            onChange={(e) => setsignEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container password-input">
          <input
            type={signpasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={signpassword}
            onChange={(e) => setsignPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-btn-sign"
            onClick={() => setsignPasswordVisible(!signpasswordVisible)}
          >
            {signpasswordVisible ? (
              <i className="fas fa-eye"></i>
            ) : (
              <i className="fas fa-eye-slash"></i>
            )}
          </button>
        </div>
        <div className="input-container password-input-confirm">
          <input
            type={confirmpasswordVisible ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => confirmsetPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-btn-confirm"
            onClick={() => setConfirmPasswordVisible(!confirmpasswordVisible)}
          >
            {confirmpasswordVisible ? (
              <i className="fas fa-eye"></i>
            ) : (
              <i className="fas fa-eye-slash"></i>
            )}
          </button>
        </div>

        {/* Display error message if email is invalid */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn">
          SIGN-UP
        </button>
      </form>
      <div className="button-container">
        <p>Already have an account?</p>
        <button className="Switch-buttons" onClick={toggleModal}>
          Login
        </button>
      </div>
      <div className="social-button-container">
        <p>Continue With</p>
        <div className="social-buttons">
          <button className="social-btn microsoft-btn">
            <i className="fa fa-windows"></i>
          </button>
          <button className="social-btn google-btn">
            <i className="fa fa-google"></i>
          </button>
          <button className="social-btn twitter-btn">
            <i className="fa fa-twitter"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;
