import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from "firebase/firestore";
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import SendText from "./SendText";
import MessagesHeader from "./MessagesHeader";

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

const Messages = (props) => {
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
        <MessagesHeader
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

        <SendText
          handleSubmit={handleSubmit}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
        />
      </div>
    </>
  );
};

export default Messages;
