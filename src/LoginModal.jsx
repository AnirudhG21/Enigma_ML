import React from "react";

const LoginModal = ({
  email,
  password,
  passwordVisible,
  setEmail,
  setPassword,
  setPasswordVisible,
  error,
  handleLoginSubmit,
  toggleModal,
}) => {
  return (
    <div>
      <h1>LOGIN</h1>
      <p>Welcome back! Please log in to continue.</p>
      <form onSubmit={handleLoginSubmit}>
        <div className="input-container">
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-container password-input">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? (
              <i className="fas fa-eye"></i>
            ) : (
              <i className="fas fa-eye-slash"></i>
            )}
          </button>
        </div>

        {/* Display error message if email is invalid */}
        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-btn">
          LOGIN
        </button>
      </form>

      <div className="button-container">
        <p>Don't have an account?</p>
        <button className="Switch-buttons" onClick={toggleModal}>
          Sign-Up
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

export default LoginModal;
