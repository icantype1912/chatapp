import React from "react"

import "../App.css"
import LeftConatainer from "../components/left-container"
import RightConatainer from "../components/right-container"




const MainPage = (props)=>{
  const {user,setUser} = props
    return(
      <div className="parent-container">
        <LeftConatainer user = {user}/>
        <RightConatainer user = {user} setUser = {setUser}/>
      </div>
    )
}

export default MainPage