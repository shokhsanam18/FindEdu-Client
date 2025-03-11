import React from "react";
import { Button } from "./components/ui/button"; 
import { Routes, Route } from "react-router-dom";
import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";

function App() {
  return (
    <div>
      <h1 className="bg-red-800">hello client</h1>
      <Button>Hello world</Button>
      <Routes>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}

export default App;
