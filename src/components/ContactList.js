import React, { useState, useEffect,useRef } from "react";
import {
  collection,
  query,
  getFirestore,
  onSnapshot,
  limit,
  where,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

import {
  apiKey,authDomain,databaseURL,storageBucket,messagingSenderId,appId,measurementId,
  projectId
} from "../firebaseconfig.js"

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

export const ContactList = (props) => {
  const { user, receiver, setReceiver, setContactLoading, search } =
    props;
  const [count, setCount] = useState(6);
  const [contacts, setContacts] = useState([]);
  const scroller = useRef()
  const handleScroll = () => {
    if (scroller.current) {
      const { scrollTop, scrollHeight, clientHeight } = scroller.current;
      if (scrollTop + clientHeight >= scrollHeight) {
        setCount((prev) => prev+5);
        scroller.current.scrollTop = scrollHeight - clientHeight - 1;
      }
    }
  };
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
      <div className="contact-list" ref={scroller}>
        {contacts
          .filter(x => 
             x.Name !== user.username
          )
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

