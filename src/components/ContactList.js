import React, { useState, useEffect } from "react";
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

const ContactList = (props) => {
  const { user, receiver, setReceiver, scroller, setContactLoading, search } =
    props;
  const [count, setCount] = useState(6);
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    setContactLoading(true);
    const q = query(
      collection(db, "Users"),
      where("Name", ">=", search.toLowerCase()),
      where("Name", "<=", search.toLowerCase() + "\uf8ff"),
      limit(count)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      let contactList = [];
      snapshot.docs.forEach((doc) => {
        contactList.push({ ...doc.data() });
      });
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
                <h3 className="receiver-name">{x.Name}</h3>
                <p>{x.message}</p>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ContactList;
