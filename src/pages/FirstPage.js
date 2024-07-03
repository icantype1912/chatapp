import React from "react";
import { useNavigate } from "react-router-dom";

const FirstPage = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };
  return (
    <div className="first-page">
      <h1>Welcome to BlueMessages</h1>
      <h2>Let's get started</h2>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignUp}>SignUp</button>
    </div>
  );
};

export default FirstPage;
