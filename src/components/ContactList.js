import React, { useState,useEffect } from "react";
import "../App.css"
import { collection,query,getFirestore,onSnapshot, limit } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const ContactList = (props) =>{
    const {user,receiver,setReceiver,scroller} = props
    const [count,setCount] = useState(5)
    const [contacts,setContacts] = useState([])
    useEffect(()=>{
        const q = query(collection(db, "Users"),limit(count));
        const unsub = onSnapshot(q,(snapshot)=>{
            let contactList = []
            snapshot.docs.forEach((doc)=>{
                contactList.push({...doc.data()});
            })
            contactList.unshift({Name:"GroupChat",message:"GC"})
            setContacts(contactList)
        })
        return ()=> unsub();
      },[count])
      useEffect(()=>{
        const handleScroll =()=>{
            if(scroller.current){
                const { scrollTop, scrollHeight, clientHeight } = scroller.current;
                if (scrollTop + clientHeight >= scrollHeight) {
                    setCount((prev)=>{ return prev+5})
                } 
            }
        }

        const div = scroller.current
        if(div){
            div.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (div) {
              div.removeEventListener('scroll', handleScroll);
            }
          };

      },[scroller]);
    return<>
        <div className="contact-list">
        {contacts.filter((x)=>{return x.Name !== user.username}).map((x)=>{
            return <div className={x.Name !== receiver?"contact-card":"selected-contact-card"} onClick={()=>{setReceiver(x.Name)}} >
                <h3>{x.Name}</h3>
                <p>{x.message}</p>
            </div>
        })}
        </div>
    </>
}

export default ContactList