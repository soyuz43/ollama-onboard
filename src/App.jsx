// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import { AppView } from "./views/ApplicationViews";
import { Authorized } from "./views/Authorized";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Index route directly rendering AppView */}
          <Route index element={<Authorized><AppView /></Authorized>} />

          {/* Specific auth routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* A catch-all route within the authorized area, typically redirects or handles 404s */}
          <Route path="/*" element={<Authorized><AppView /></Authorized>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
