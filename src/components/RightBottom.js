import React from "react";
import "../App.css"

const RightBottom = (props)=>{
    const {handleSubmit,message,setMessage,handleSend} = props
    return<div className="bottom">
    <form className="sendMes" onSubmit={handleSubmit}>
        <input type="text" placeholder="Type a message" value={message} onChange={(e)=>{setMessage(e.target.value)}}></input>
        <button onClick={handleSend}>➤</button>
    </form>
    </div>
}

export default RightBottom