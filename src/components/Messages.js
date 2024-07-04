import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from "firebase/firestore";
import { addDoc, collection, query, onSnapshot } from "firebase/firestore";
import { signOut, getAuth } from "firebase/auth";
import { SendText } from "./SendText";
import { MessagesHeader } from "./MessagesHeader";
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

export const Messages = (props) => {
  const navigate = useNavigate();
  const { user, setUser, receiver } = props;
  const ref = useRef();
  const time = new Date();
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [allMessages]);
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
      setAllMessages(newTasks);
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

  const onLogOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = (msg, setMsg) => {
    if (typeof msg !== "string") {
      return;
    }
    const cleanedMessage = msg.trim();
    if (cleanedMessage === "") {
      return;
    }
    addUserToFirestore(cleanedMessage);
    setMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <>
      <div className="right-container">
        <MessagesHeader receiver={receiver} user={user} onLogOut={onLogOut} />

        <div className="middle" ref={ref}>
          {allMessages.map((x) => {
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

        <SendText handleSubmit={handleSubmit} handleSend={handleSend} />
      </div>
    </>
  );
};
