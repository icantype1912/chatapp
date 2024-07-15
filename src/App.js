  import React from "react";
  import { lazy, Suspense } from "react";
  import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { ErrorBoundary } from "react-error-boundary";

  import "./App.css";
  const Home = lazy(() => import("./pages/Home"));
  const Login = lazy(() => import("./pages/Login"));
  const SignUp = lazy(() => import("./pages/SignUp"));
  const Landing = lazy(() => import("./pages/Landing"));
  const NotFound = lazy(() => import("./pages/NotFound"));
  const Profile = lazy(()=>import("./pages/Profile"))

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
        <ErrorBoundary
          fallback={
            <div className="error-boundary">
              <h1>Something went wrong!</h1>
              <h2>Refresh the page or try again later</h2>
            </div>
          }
        >
          <div id="branding">
            <h1>BlueMessages</h1>
          </div>
          <BrowserRouter>
            <Suspense fallback={<span className="loader2"></span>}>
              {user === null ? (
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                  <Route path="/signup" element={<SignUp setUser={setUser} />} />
                  <Route path="/profile" element={<Profile user={user}/>} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              ) : (
                <Routes>
                  <Route
                    path="/"
                    element={<Home user={user} setUser={setUser} />}
                  />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="/profile" element={<Profile user={user}/>} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              )}
            </Suspense>
          </BrowserRouter>
        </ErrorBoundary>
      </>
    );
  };

  export default App;
