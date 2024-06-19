import React from "react"
import "../App.css"
import LeftConatainer from "../components/left-container"
import RightConatainer from "../components/right-container"

const MainPage = ()=>{
    return(
      <div className="parent-container">
        <LeftConatainer/>
        <RightConatainer/>
      </div>
    )
}

export default MainPage