import React from "react";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { emailValidator } from "../validator";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
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
    if (!emailValidator(email)) {
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
        navigate("/");
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
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </>
  );
};

export default Login;
