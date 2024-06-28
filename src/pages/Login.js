import React from "react";
import { useState } from "react";
import "../App.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const firebaseConfig = {
  apiKey: "AIzaSyCWPADseIx3PRGx3j4Tgh6TS9JOuwt2GE4",
  authDomain: "chatapp-c4efb.firebaseapp.com",
  databaseURL: "https://chatapp-c4efb-default-rtdb.asia-southeast1.firebasedatabase.app",
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
  const Navigate = useNavigate();
  const [err,setErr] = useState("")
  const [disabled, setDisable] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.match(emailRegex)) {
      setDisable(false);
    } else {
      setDisable(true);
    }
  };
  const handleClick = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser({username:userCredential.user.displayName,email:userCredential.user.email,phone:userCredential.user.phone});
        console.log(userCredential.user)
        Navigate("/mainpage");
      })
      .catch((err) => {
        setErr(err.message);
      });
  };
  return (
    <>
      <div className="login-table">
        <h1>Login</h1>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => handleEmailChange(e)}
        ></input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <p className="signinerror">{err}</p>
        <button className={disabled?"disabledButton":"enabledButton"}
          disabled={disabled}
          onClick={handleClick}
        >
          Login
        </button>
        <p>
          Don't have an account? <Link to="/signup">signup</Link>
        </p>
      </div>
    </>
  );
};

export default Login;
