import React from "react";
import { Button } from "./components/ui/button.jsx";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";
import Forget from "./Register/Login/Forget.jsx";
import VerifyOtp from "./Register/Login/VerifyOtp.jsx";
function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <Link to="/Register">
              <Button>Register</Button>
            </Link>
          }
        />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Forget" element={<Forget />} />
        <Route path="/VerifyOtp" element={<VerifyOtp />} />
        <Route path="*" element={<h1>You logged in successfully.</h1>} />
      </Routes>
    </div>
  );
}

export default App;
