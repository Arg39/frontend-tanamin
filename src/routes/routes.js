import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/login";
import Daftar from "../pages/daftar";
import Beranda2 from "../pages/beranda_baru";
import Beranda from "../pages/beranda";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Beranda2 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/daftar" element={<Daftar />} />
      <Route path="/beranda" element={<Beranda />} />
    </Routes>
  );
};

export default AppRoutes;
