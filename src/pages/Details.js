import React from "react";
import { useState } from "react";
import "../App.css"
import { getAuth,updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {getFirestore,collection,addDoc} from "firebase/firestore"
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

const auth = getAuth()
const Details = (props)=>{
    const {setUser} = props
    const date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2,'0');
    const day = String(date.getDate()+1).padStart(2,'0');
    const currentDate = `${year}-${month}-${day}`
    const phnoRegex = /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/;
    const Navigate = useNavigate()
    const [errMessage,setErrMessage] = useState("")
    const [userdetails,setUserDetails] = useState({uname:"",phno:"",dob:""})

    const addUser = async ()=>{
        try {
            const docRef = await addDoc(collection(db, "Users"), {
              Name:userdetails.uname,
              message:"does not matter"
            });
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
    }
    const handleUsername = (e)=>{
        setUserDetails((prev)=>({...prev,uname:e.target.value}))
    }

    const handlePhno = (e)=>{
        setUserDetails((prev)=>({...prev,phno:e.target.value}))
    }

    const handleDOB = (e)=>{
        setUserDetails((prev)=>({...prev,dob:e.target.value}))
    }

    const handleProceed = ()=>{
        if(userdetails.uname.length < 3)
            {
                setErrMessage("Username should be atleast 3 chars")
                return
            }
        if(!userdetails.phno.match(phnoRegex))
            {
                setErrMessage("Invalid phone number")
                return
            }
        updateProfile(auth.currentUser,{
            displayName:userdetails.uname,phone:userdetails.phno,dob:userdetails.dob
        }).then(()=>{
            setUser({username:auth.currentUser.displayName,email:auth.currentUser.email,phone:auth.currentUser.phone})
            addUser()
            Navigate("/mainpage")
        }).catch((e)=>{console.log(e)})
    }

    return <>
    <div className="details-table">
        <h1>More Details</h1>
        <input 
        value={userdetails.uname} 
        onChange={handleUsername}
        placeholder="Username" />

        <input 
        type="number" 
        value={userdetails.phno}
        onChange={handlePhno}
        placeholder="Phone Number"/>

        <input 
        type="date" 
        value={userdetails.dob} 
        onChange={handleDOB} 
        min='1899-01-01' 
        max={currentDate}
        />

        <p className="error">{errMessage}</p>
        <button onClick={handleProceed}>Proceed</button>
      </div>
    </>
}

export default Details