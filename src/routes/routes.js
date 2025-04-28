import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/login';
import Daftar from '../pages/daftar';
import Beranda2 from '../pages/beranda_baru';
import Beranda from '../pages/beranda';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/beranda" replace />} />
      <Route path="/beranda" element={<Beranda2 />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/daftar" element={<Daftar />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/beranda-lama" element={<Beranda />} />
    </Routes>
  );
};

export default AppRoutes;
