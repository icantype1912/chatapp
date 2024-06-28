import React, { useState, useEffect } from "react";
import "../App.css";
import {
  collection,
  query,
  getFirestore,
  onSnapshot,
  limit,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const ContactList = (props) => {
  const { user, receiver, setReceiver, scroller, setContactLoading, search } =
    props;
  const [count, setCount] = useState(6);
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    setContactLoading(true);
    const q = query(
      collection(db, "Users"),
      where("Name", ">=", search),
      where("Name", "<=", search + "\uf8ff"),
      limit(count)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let contactList = [];
      snapshot.docs.forEach((doc) => {
        contactList.push({ ...doc.data() });
      });
      console.log("This is search", search);
      setContacts(contactList);
      setContactLoading(false);
    });
    return () => unsub();
  }, [count, setContactLoading, search]);
  useEffect(() => {
    const handleScroll = () => {
      if (scroller.current) {
        const { scrollTop, scrollHeight, clientHeight } = scroller.current;
        if (scrollTop + clientHeight >= scrollHeight) {
          setCount((prev) => {
            return prev + 5;
          });
          scroller.current.scrollTop = scrollHeight - clientHeight - 1;
        }
      }
    };

    const div = scroller.current;
    if (div) {
      div.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (div) {
        div.removeEventListener("scroll", handleScroll);
      }
    };
  }, [scroller]);
  return (
    <>
      <div className="contact-list">
        {contacts
          .filter((x) => {
            return x.Name !== user.username;
          })
          .map((x) => {
            return (
              <div
                className={
                  x.Name !== receiver ? "contact-card" : "selected-contact-card"
                }
                onClick={() => {
                  setReceiver(x.Name);
                }}
              >
                <h3>{x.Name}</h3>
                <p>{x.message}</p>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ContactList;
