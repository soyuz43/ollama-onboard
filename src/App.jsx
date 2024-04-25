// src/App.jsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Header } from "./components/persistant/Header";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import { AppView } from "./views/ApplicationViews";
import { Authorized } from "./views/Authorized";

export const App = () => {
  return (
    <BrowserRouter>
      <Header /> {/* Ensures Header is visible across all routes */}
      <div className="main-content" style={{ paddingTop: '60px' }}> {/* Padding to push content below the header */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Authorized><AppView /></Authorized>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};
