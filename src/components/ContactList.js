import React from "react";
import "../App.css"

const ContactList = () =>{
    const contacts = [{name:"adi",message:"Need to catch up"},{name:"sash",message:"you ok?"},{name:"amogh",message:"rr was fun"},{name:"ak",message:"go like my story"},{name:"naag",message:"whines"},{name:"naag",message:"whines"},{name:"naag",message:"whines"},{name:"naag",message:"whines"},{name:"naag",message:"whines"},{name:"naag",message:"whines"},{name:"naag",message:"whines"}]
    return<>
        <div className="contact-list">
        {contacts.map((x)=>{
            return <div className="contact-card">
                <h3>{x.name}</h3>
                <p>{x.message}</p>
            </div>
        })}
        </div>
    </>
}

export default ContactList