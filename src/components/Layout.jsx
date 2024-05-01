// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./persistant/Header";
// import './StylesComponents/layout.css'
export const Layout = () => {
  return (
    <>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};
