import React, { useRef, useState } from "react";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from "firebase/firestore";
import { addDoc,collection,query,onSnapshot } from "firebase/firestore";
import { signOut,getAuth } from "firebase/auth";
import { Popover } from "@mui/material";
import "../App.css"

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

const RightConatainer = (props)=>{
    const Navigate = useNavigate()
    const {user,setUser,receiver} = props
    const ref = useRef()
    const time = new Date()
    const [popen,setPopen] = useState(false)
    const [message,setMessage] = useState("")
    const [messages,setMessages] = useState([])
    
      useEffect(()=>{
        ref.current.scrollTop = ref.current.scrollHeight;
      },[messages])
      useEffect(()=>{
        const q = query(collection(db, "Chat"),orderBy("time"));
        const unsub = onSnapshot(q,(snapshot)=>{
            let tasks = []
            snapshot.docs.forEach((doc)=>{
                tasks.push({...doc.data()});
            })
            console.log(tasks)
            console.log(user.username)
            console.log(receiver)
            const newTasks = tasks.filter((x)=>{
                if(((user.username === x.user)&&(x.receiver === receiver))||((user.username === x.receiver)&&(receiver === x.user))||((receiver === "GroupChat")&&(x.receiver === "GroupChat")))
                    {
                        return true
                    }
                return false
            })
            setMessages(newTasks)
        })
        return ()=> unsub();
      },[receiver,user.username])

    const addUserToFirestore = async(mes)=>{
        try{
            const docRef = await addDoc(collection(db,"Chat"),{
                message:mes,
                user:user.username,
                receiver:receiver,
                time:time.getTime()
            });
            console.log("Added with doc id",docRef.id)
        }
        catch(err)
        {
            console.error(err)
        }
    }

    const onLogOut = ()=>{
        signOut(auth).then(()=>{
            console.log("logged out")
            setUser(null)
            Navigate("/login")
        }).catch((error)=>{
            console.log(error)
        })
        
    }

    const handleSend = ()=>{
        const cleanedMessage = message.trim()
        if(cleanedMessage === "")
        {
            return
        }
        addUserToFirestore(cleanedMessage)
        setMessage("")
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        handleSend()
    }

    return<>
        <div className="right-container">
            <div className="top">
                <h2>{receiver}</h2>
                <div className="user-details">
                    <button id="profile" onClick={(e)=>setPopen(e.currentTarget)}>
                    <svg
                        fill="#000000"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        width= "43px"
                        height="42px"
                        viewBox="0 0 45.532 45.532"
                        className="profile-icon"
                    >
              <g>
                <path
                  d="M22.766,0.001C10.194,0.001,0,10.193,0,22.766s10.193,22.765,22.766,22.765c12.574,0,22.766-10.192,22.766-22.765
                        S35.34,0.001,22.766,0.001z M22.766,6.808c4.16,0,7.531,3.372,7.531,7.53c0,4.159-3.371,7.53-7.531,7.53
                        c-4.158,0-7.529-3.371-7.529-7.53C15.237,10.18,18.608,6.808,22.766,6.808z M22.761,39.579c-4.149,0-7.949-1.511-10.88-4.012
                        c-0.714-0.609-1.126-1.502-1.126-2.439c0-4.217,3.413-7.592,7.631-7.592h8.762c4.219,0,7.619,3.375,7.619,7.592
                        c0,0.938-0.41,1.829-1.125,2.438C30.712,38.068,26.911,39.579,22.761,39.579z"
                />
              </g>
                    </svg>
                    </button>
                    <Popover
                      open = {popen}
                      onClose={()=>{setPopen(false)}}
                      anchorEl={popen}
                      anchorOrigin={{vertical:'bottom',horizontal:'left'}}
                      sx={{
                        '& .MuiPopover-paper':{
                        backgroundColor: '#1F1F2B'},
                    }}
                      >
                        <div id="pop">
                            <h3>Email : {user.email}</h3>
                            <h3>Username : {user.username}</h3>
                            <button onClick={onLogOut}>LogOut</button>
                        </div>
                    </Popover>
                </div>
            </div>

            <div className="middle" ref = {ref}> 
                {messages.map((x)=>{
                    return(<>
                        <div className={user.username === x.user?"from-message":"to-message"}>
                            <p className="user-tag">{x.user}</p>
                            <h4>{x.message}</h4>
                        </div>
                    </>
                    )
                })}
            </div>

            <div className="bottom">
                <form className="sendMes" onSubmit={handleSubmit}>
                    <input type="text" placeholder="Type a message" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
                    <button onClick={handleSend}>➤</button>
                </form>
            </div>
        </div>
    </>
}

export default RightConatainer