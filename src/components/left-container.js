import React from "react";
import "../App.css"
import ContactList from "./ContactList";

const LeftConatainer = ()=>{
    return<>
        <div className="left-container">
            <input type="text" className="search" placeholder="Search"></input>
            <ContactList/>
        </div>
    </>
}

export default LeftConatainer