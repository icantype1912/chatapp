import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { validateEmail } from "../validator";
import {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  projectId,
} from "../firebaseconfig.js";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  databaseURL: databaseURL,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
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
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (validateEmail(val)) {
      setDisable(false);
      if (err === "Please enter your valid email address") {
        setErr("");
      }
    } else {
      setDisable(true);
      setErr("Please enter your valid email address");
    }
  };
  const handleClick = async () => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUser({
        username: userCredential.user.displayName,
        email: userCredential.user.email,
        phone: userCredential.user.phone,
      });
      navigate("/");
    } catch (err) {
      if (err.code) {
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
      }
    } finally {
      setLoading(false);
    }
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
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </>
  );
};

export default Login;
