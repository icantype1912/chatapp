import React from "react"
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom"



import "./App.css"
import MainPage from "./pages/MainPage"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import FirstPage from "./pages/FirstPage"


const App = ()=>{
    return(<>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FirstPage/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/mainpage" element={<MainPage/>}/>
          <Route path = "*" element={<Navigate to ="/"/>}/>
        </Routes>
      </BrowserRouter>
    </>
    )
}

export default App