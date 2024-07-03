import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCWPADseIx3PRGx3j4Tgh6TS9JOuwt2GE4",
  authDomain: "chatapp-c4efb.firebaseapp.com",
  databaseURL:
    "https://chatapp-c4efb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chatapp-c4efb",
  storageBucket: "chatapp-c4efb.appspot.com",
  messagingSenderId: "636388695939",
  appId: "1:636388695939:web:670642ea7b197c9c8560b6",
  measurementId: "G-MDS2Z8B9JL",
};

initializeApp(firebaseConfig);

const auth = getAuth();
const Login = (props) => {
  const { setUser } = props;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("Please enter your valid email address");
  const [disabled, setDisable] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.match(emailRegex)) {
      setDisable(false);
      if (err === "Please enter your valid email address") {
        setErr("");
      }
    } else {
      setDisable(true);
      setErr("Please enter your valid email address");
    }
  };
  const handleClick = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser({
          username: userCredential.user.displayName,
          email: userCredential.user.email,
          phone: userCredential.user.phone,
        });
        setLoading(false);
        navigate("/mainpage");
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-credential":
            setErr("Your Username and Password do not match");
            break;
          case "auth/missing-password":
            setErr("Please enter your password");
            break;
          default:
            setErr(err.code);
        }
        setLoading(false);
      });
  };
  return (
    <>
      <form className="login-table" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <p id="labels">Email</p>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => handleEmailChange(e)}
        ></input>
        <p id="labels">Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <p className="signinerror">{err}</p>
        {!loading ? (
          <button
            className={disabled ? "disabledButton" : "enabledButton"}
            disabled={disabled}
            onClick={handleClick}
          >
            Login
          </button>
        ) : (
          <span className="load"></span>
        )}
        <p>
          Don't have an account? <Link to="/signup">signup</Link>
        </p>
      </form>
    </>
  );
};

export default Login;
