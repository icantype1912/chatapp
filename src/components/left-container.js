import React, { useState,useRef } from "react";
import "../App.css"
import ContactList from "./ContactList";

const LeftConatainer = (props)=>{
    const scroller = useRef()
    const {user,receiver,setReceiver} = props
    const [search,setSearch] = useState("")
    return<>
        <div className="left-container" ref={scroller}>
            <input type="text" className="search" placeholder="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}></input>
            <ContactList user = {user} receiver = {receiver} setReceiver = {setReceiver} scroller = {scroller}/>
        </div>
    </>
}

export default LeftConatainer