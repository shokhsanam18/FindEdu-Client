import React from "react";
import { Footer } from "./footer";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};
