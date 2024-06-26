import React, { useState } from "react";
import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, orderBy } from "firebase/firestore";
import { addDoc,collection,query,onSnapshot } from "firebase/firestore";
import { signOut,getAuth } from "firebase/auth";
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
    const time = new Date()
    //const [count,setCount] = useState(0)
    const [message,setMessage] = useState("")
    const [messages,setMessages] = useState([])

      
      useEffect(()=>{
        const q = query(collection(db, "Chat"),orderBy("time"));
        const unsub = onSnapshot(q,(snapshot)=>{
            let tasks = []
            snapshot.docs.forEach((doc)=>{
                tasks.push({...doc.data()});
            })
            setMessages(tasks)
        })
        return ()=> unsub();
      },[])

    const addUserToFirestore = async(mes)=>{
        try{
            const docRef = await addDoc(collection(db,"Chat"),{
                message:mes,
                user:user,
                time:time.getTime()
            });
            console.log("Added with doc id",docRef.id)
        }
        catch(err)
        {
            console.error(err)
        }
    }

    const Navigate = useNavigate()
    const {user,setUser} = props
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

    return<>
        <div className="right-container">
            <div className="top">
                <h2>Whom you are talking to</h2>
                <div className="user-details">
                    <h3>username</h3>
                    <button onClick={onLogOut}>logout</button>
                </div>
            </div>

            <div className="middle">
                {messages.map((x)=>{
                    return(<>
                        <div className={user === x.user?"from-message":"to-message"}>
                            <p className="user-tag">{x.user}</p>
                            <h4>{x.message}</h4>
                        </div>
                    </>
                    )
                })}
            </div>

            <div className="bottom">
                <input type="text" placeholder="type a message" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
                <button onClick={handleSend}>➤</button>
            </div>
        </div>
    </>
}

export default RightConatainer