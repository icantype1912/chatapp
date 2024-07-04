import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/");
  };
  return (
    <div id="error-box">
      <h1>Page Not Found...</h1>
      <h2>Looks like the page you were searching for does not exist :/</h2>
      <button onClick={handleClick}>Back to home</button>
    </div>
  );
};

export default NotFound;
