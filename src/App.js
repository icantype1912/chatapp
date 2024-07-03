import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import FirstPage from "./pages/FirstPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse");
      }
    }
  }, []);

  useEffect(() => {
    if (user !== null) {
      window.localStorage.setItem("user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <>
      <div id="branding">
        <h1>BlueMessages</h1>
      </div>
      <BrowserRouter>
        {user === null ? (
          <Routes>
            <Route path="/" element={<FirstPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<SignUp setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route
              path="/mainpage"
              element={<MainPage user={user} setUser={setUser} />}
            />
            <Route path="*" element={<Navigate to="/mainpage" />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
};

export default App;
