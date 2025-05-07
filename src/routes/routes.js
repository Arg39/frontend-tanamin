import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuthStore from '../zustand/authStore';
import Login from '../pages/login';
import Daftar from '../pages/daftar';
import Beranda2 from '../pages/beranda';
import NotFound from '../pages/NotFound';
import DashboardAdmin from '../pages/admin/dashboard';
import Category from '../pages/admin/category/category';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, fetchUserData } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const initializeUser = async () => {
      if (!currentUser) {
        const fetchedUser = await fetchUserData();
        setCurrentUser(fetchedUser);
      }
      setLoading(false);
    };

    initializeUser();
  }, [currentUser, fetchUserData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <NotFound />;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return <NotFound />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/beranda" replace />} />
      <Route path="/beranda" element={<Beranda2 />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/daftar" element={<Daftar />} />

      {/* Group route for admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              <Route path="dashboard" element={<DashboardAdmin />} />
              <Route path="kategori" element={<Category />} />
              <Route path="*" element={<NotFound />} /> {/* Tambahkan fallback ini */}
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Group route for instructor */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute requiredRole="instructor">
            <Routes>
              {/* Tambahkan rute instruktur di sini */}
              <Route path="*" element={<NotFound />} /> {/* Tambahkan fallback ini */}
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
