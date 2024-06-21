import React from "react";
import { useState } from "react";
import "../App.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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
console.log("This is getauth", getAuth());

const SignUp = (props) => {
  const { setUser } = props;
  const [errState, setErrState] = useState("");
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  const handleClick = () => {
    if (!email.match(emailRegex)) {
      setErrState("Invalid email");
      return;
    }
    if (!password.match(passwordRegex)) {
      setErrState("Min-8 charectars atleast 1 charectar of each type");
      return;
    }
    if (password !== confirm) {
      setErrState("Password and confirm password should be the same");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user.email);
        Navigate("/mainpage");
      })
      .catch((err) => {
        setErrState(err.message);
      });
  };
  return (
    <>
      <div className="signup-table">
        <h1>SignUp</h1>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        ></input>
        <button onClick={handleClick}>SignUp</button>
        <p className="signinerror">{errState}</p>
        <p>
          Already have an account?<Link to="/login">Login</Link>
        </p>
      </div>
    </>
  );
};

export default SignUp;
