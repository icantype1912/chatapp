import React from "react";
import { useState } from "react";
import "../App.css"
import { getAuth,updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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