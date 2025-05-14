import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import useAuthStore from '../zustand/authStore';
import Login from '../pages/login';
import Register from '../pages/register';
import Beranda2 from '../pages/beranda';
import NotFound from '../pages/NotFound';
import DashboardAdmin from '../pages/admin/dashboard';
import Category from '../pages/admin/category/category';
import CategoryAdd from '../pages/admin/category/categoryAdd';
import CategoryEdit from '../pages/admin/category/categoryEdit';
import Course from '../pages/admin/course/course';
import Instructor from '../pages/admin/user/instructor';
import InstructorAdd from '../pages/admin/user/instructorAdd';
import DashboardInstructor from '../pages/instructor/dashboard';
import Payment from '../pages/student/testPayment';
import CourseAdd from '../pages/admin/course/courseAdd';

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

const adminRoutes = [
  { path: 'dashboard', element: <DashboardAdmin /> },
  { path: 'kategori', element: <Category /> },
  { path: 'kategori/tambah', element: <CategoryAdd /> },
  { path: 'kategori/edit/:id', element: <CategoryEdit /> },
  { path: 'instruktur', element: <Instructor /> },
  { path: 'instruktur/tambah', element: <InstructorAdd /> },
  { path: 'kursus', element: <Course /> },
  { path: 'kursus/tambah', element: <CourseAdd /> },
];

const instructorRoutes = [
  { path: 'dashboard', element: <DashboardInstructor /> },
  // Add more instructor-specific routes here
];

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/beranda" replace />} />
      <Route path="/beranda" element={<Beranda2 />} />
      <Route path="/masuk" element={<Login />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/coba-payment" element={<Payment />} />

      {/* Group route for admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <Routes>
              {adminRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        }
      />

      {/* Group route for instructor */}
      <Route
        path="/instruktur/*"
        element={
          <ProtectedRoute requiredRole="instructor">
            <Routes>
              {instructorRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
