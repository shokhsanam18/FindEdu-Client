import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";
import { Layout } from "./components/Layout.jsx";
import Forget from "./Register/Login/Forget.jsx";
import VerifyOtp from "./Register/Login/VerifyOtp.jsx";
import ErrorPage from "./Register/Login/Error.jsx";
import About from "./Register/Login/Aboutus.jsx";
import { Cards } from "./components/ui/Cards.jsx";
import CeoPage from "./Pages/CeoPage.jsx";
import { AuthProvider } from "./context/auth.jsx";

function App() {
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Cards />} />
            <Route path="/About" element={<About />} />
            <Route path="/ceo" element={<CeoPage />} />
          </Route>
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Forget" element={<Forget />} />
          <Route path="/VerifyOtp" element={<VerifyOtp />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/you"
            element={
              <h1 className="bg-green-500 text-5xl">
                You logged in successfully. YAY YAY!!!(Yes It Is 404 Error Page)
              </h1>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
