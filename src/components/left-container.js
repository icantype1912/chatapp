import React from "react";
import "../App.css"
import ContactList from "./ContactList";

const LeftConatainer = (props)=>{
    const {user} = props
    return<>
        <div className="left-container">
            <input type="text" className="search" placeholder="Search"></input>
            <ContactList user = {user}/>
        </div>
    </>
}

export default LeftConatainer