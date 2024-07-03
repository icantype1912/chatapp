import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from "firebase/firestore";
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import RightBottom from "./RightBottom";
import RightTop from "./RightTop";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const RightConatainer = (props) => {
  const navigate = useNavigate();
  const { user, setUser, receiver } = props;
  const ref = useRef();
  const time = new Date();
  const [popen, setPopen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);
  useEffect(() => {
    const q = query(collection(db, "Chat"), orderBy("time"));
    const unsub = onSnapshot(q, (snapshot) => {
      let tasks = [];
      snapshot.docs.forEach((doc) => {
        tasks.push({ ...doc.data() });
      });
      const newTasks = tasks.filter(
        (x) =>
          (user.username === x.user && x.receiver === receiver) ||
          (user.username === x.receiver && receiver === x.user) ||
          (receiver === "groupchat" && x.receiver === "groupchat")
      );
      setMessages(newTasks);
    });
    return () => unsub();
  }, [receiver, user.username]);

  const addUserToFirestore = async (mes) => {
    try {
      await addDoc(collection(db, "Chat"), {
        message: mes,
        user: user.username,
        receiver: receiver,
        time: time.getTime(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const onLogOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSend = () => {
    const cleanedMessage = message.trim();
    if (cleanedMessage === "") {
      return;
    }
    addUserToFirestore(cleanedMessage);
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      <div className="right-container">
        <RightTop
          receiver={receiver}
          user={user}
          popen={popen}
          setPopen={setPopen}
          onLogOut={onLogOut}
        />

        <div className="middle" ref={ref}>
          {messages.map((x) => {
            return (
              <>
                <div
                  className={
                    user.username === x.user ? "from-message" : "to-message"
                  }
                >
                  <p className="user-tag">{x.user}</p>
                  <h4>{x.message}</h4>
                </div>
              </>
            );
          })}
        </div>

        <RightBottom
          handleSubmit={handleSubmit}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />
      </div>
    </>
  );
};

export default RightConatainer;
