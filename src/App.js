import React from "react"
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom"
import { useState,useEffect } from "react"


import "./App.css"
import MainPage from "./pages/MainPage"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import FirstPage from "./pages/FirstPage"
import Details from "./pages/Details"


const App = ()=>{
  const [user,setUser] = useState(null);
  
  console.log("This is the user",user,typeof(user))
  useEffect(()=>{
    const storedUser = window.localStorage.getItem('user')
    if(storedUser)
      {
        try
        {
          console.log("worked")
          setUser(JSON.parse(storedUser))
          console.log("parsed")
        }
        catch(error)
        {
          console.error("Failed to parse")
        }
      }
  },[])

  useEffect(()=>{
    if(user !== null)
      {
        window.localStorage.setItem('user',JSON.stringify(user))
      }
    else{
      window.localStorage.removeItem('user');
    }
  },[user])

    return(<>
      <BrowserRouter>
      {(user === null)?
        <Routes>
          <Route path="/" element={<FirstPage/>}/>
          <Route path="/login" element={<Login setUser = {setUser}/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/Details" element={<Details  setUser = {setUser}/>}/>
          <Route path = "*" element={<Navigate to ="/"/>}/>
        </Routes>:
        <Routes>
        <Route path="/Details" element={<Details  setUser = {setUser}/>}/>
        <Route path="/mainpage" element={<MainPage user = {user} setUser = {setUser}/>}/>
        <Route path = "*" element={<Navigate to ="/mainpage"/>}/>
      </Routes>
        }
      </BrowserRouter>
    </>
    )
}

export default App