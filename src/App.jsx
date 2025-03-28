import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";
import { Layout } from "./components/Layout.jsx";
import Forget from "./Register/Login/Forget.jsx";
import VerifyOtp from "./Register/Login/VerifyOtp.jsx";
import ErrorPage from "./Register/Login/Error.jsx";
import About from "./Register/Login/Aboutus.jsx";
import { Index } from "./Pages/Index-page.jsx";
import CeoPage from "./Pages/CeoPage.jsx";
import { AuthProvider } from "./context/auth";
import { useAuthStore } from "./Store.jsx";
function App() {


  const autoRefreshToken = useAuthStore((state) => state.autoRefreshToken);

  useEffect(() => {
    autoRefreshToken();
  }, [autoRefreshToken]);

  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Index />} />
            <Route path="/About" element={<About />} />
          </Route>
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Forget" element={<Forget />} />
          <Route path="/VerifyOtp" element={<VerifyOtp />} />
          <Route path="/CEO" element={<CeoPage />} />
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
