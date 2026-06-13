import React, { useState } from "react";
import "./App.css";

function App() {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return (
      <div className="home">
        <h2>🤖 AI Companion</h2>
        <p>Welcome Back!</p>
      </div>
    );
  }

  return (
    <>
      <div className="login-container">
        <h2>AI Companion</h2>

        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />

        <button onClick={() => setLoggedIn(true)}>
          Login
        </button>

        <p
          className="signup-link"
          onClick={() => setShowSignup(true)}
        >
          Sign Up
        </p>
      </div>

      {showSignup && (
        <div className="overlay">
          <div className="popup">
            <h3>Create Account</h3>

            <input
              type="text"
              placeholder="Username"
            />

            <input
              type="email"
              placeholder="Email"
            />

            <input
              type="password"
              placeholder="Password"
            />

            <button>Create Account</button>

            <button
              className="close-btn"
              onClick={() => setShowSignup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;