import React, { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
// import Register from "./Register/Login/Register.jsx";
import Login from "./Register/Login/Login.jsx";
import { Layout } from "./components/Layout.jsx";
import Forget from "./Register/Login/Forget.jsx";
import VerifyOtp from "./Register/Login/VerifyOtp.jsx";
import ErrorPage from "./Register/Login/Error.jsx";
import About from "./Register/Login/Aboutus.jsx";
import { Index } from "./Pages/Index-page.jsx";
import CeoPage from "./Pages/CeoPage.jsx";
import CenterDetail from "./Pages/CenterDetail.jsx";
import { AuthProvider } from "./context/auth";
import { useAuthStore } from "./Store.jsx";
import { Resources } from "./Pages/Resources.jsx";
import Test from "./Test.jsx";
import { Appointment } from "./Pages/appointment.jsx";

import Favorites from "./Pages/Favorites.jsx";
import FormTry from "./Register/Login/Register.jsx";
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
            <Route path="/centers/:id" element={<CenterDetail />} />
            <Route path="/CEO" element={<CeoPage />} />
            <Route path="/Favorites" element={<Favorites />} />
            <Route path="/Resources" element={<Resources />} />
            <Route path="/Appointment" element={<Appointment/>} />
          </Route>
          <Route path="/Register" element={<FormTry />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Forget" element={<Forget />} />
          <Route path="/VerifyOtp" element={<VerifyOtp />} />
          <Route path="/Test" element={<Test />} />
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
