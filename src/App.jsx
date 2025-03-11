import React from "react";
import { Button } from "./components/ui/button"; 
import { Routes, Route } from "react-router-dom";
import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Forget" element={<h1>Forget password page.</h1>} />
        <Route path="*" element={<h1>You logged in successfully.</h1>} />
      </Routes>
    </div>
  );
}

export default App;
