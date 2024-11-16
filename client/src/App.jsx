import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Login from "./components/SignUP/Login";
import Register from "./components/SignUP/Register";
import PersistLogin from "./components/SignUP/PersistLogin";
import ChatDashboard from "./components/Pages/ChatDashboard";

const App=()=>{
  return(
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />

        <Route element={<PersistLogin />} >
          <Route path='/' element={<ChatDashboard/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App