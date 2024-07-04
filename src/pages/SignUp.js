import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Link } from "react-router-dom";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { validateEmail, validatePassword } from "../validator.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

const SignUp = (props) => {
  const navigate = useNavigate();
  const { setUser } = props;
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errState, setErrState] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };
  const addUser = async () => {
    try {
      await addDoc(collection(db, "Users"), {
        Name: username.toLowerCase(),
        message: "does not matter",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleClick = async () => {
    try {
      setLoading(true);

      if (!validateEmail(email)) {
        setLoading(false);
        setErrState("Invalid email");
        return;
      }

      if (!validatePassword(password)) {
        setLoading(false);
        setErrState(
          "Password must be min-8 characters and must contain at least one uppercase, lowercase, digit, and a symbol"
        );
        return;
      }

      if (password !== confirm) {
        setLoading(false);
        setErrState("Password and confirm password should be the same");
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: username.toLowerCase(),
      });

      setUser({
        username: auth.currentUser.displayName,
        email: auth.currentUser.email,
      });

      await addUser();

      navigate("/");
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setErrState("Email already in use");
          break;
        default:
          setErrState(err.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="signup-table">
        <h1>SignUp</h1>
        <p id="labels">Email</p>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <p id="labels">Username</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <p id="labels">Password</p>
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <p id="labels">Confirm Password</p>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        ></input>
        {!loading ? (
          <button onClick={handleClick}>SignUp</button>
        ) : (
          <span className="load"></span>
        )}
        <p className="signinerror">{errState}</p>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </>
  );
};

export default SignUp;
