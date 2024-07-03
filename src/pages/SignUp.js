import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Link } from "react-router-dom";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import {emailValidator,passwordValidator} from "../validator.js"

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const auth = getAuth();

const SignUp = (props) => {
  const navigate = useNavigate()
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
  const handleClick = async() => {
  try{
    setLoading(true);
    if (!emailValidator(email)) {
      setLoading(false);
      setErrState("Invalid email");
      return;
    }
    if (!passwordValidator(password)) {
      setLoading(false);
      setErrState(
        "Password must be min-8 charectars and must contain atleast one uppercase,lowercase,digit and a symbol"
      );
      return;
    }
    if (password !== confirm) {
      setLoading(false);
      setErrState("Password and confirm password should be the same");
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password)
        setLoading(false);
        updateProfile(auth.currentUser, {
          displayName: username.toLowerCase(),
        })
          .then(() => {
            setUser({
              username: auth.currentUser.displayName,
              email: auth.currentUser.email,
            });
            addUser();
          })
          .catch((e) => {
            console.log(e);
          });
      }
      catch(err) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setErrState("Email already in use");
            break;
          default:
            setErrState(err.code);
        }
        setLoading(false);
      }
      finally{
        navigate("/")
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
