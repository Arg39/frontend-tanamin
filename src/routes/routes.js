import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
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
import CourseAdmin from '../pages/instructor/course.jsx/course';
import CuourseDetailInstructor from '../pages/instructor/course.jsx/courseDetailInstructor';
import CuourseDetailAdmin from '../pages/admin/category/courseDetailAdmin';
import CourseAttributeEdit from '../pages/instructor/course.jsx/edit/atributEdit';
import ModulAdd from '../pages/instructor/course.jsx/tambah/materi/modulAdd';
import LessonAdd from '../pages/instructor/course.jsx/tambah/materi/lessonAdd';
import LessonDetail from '../pages/instructor/course.jsx/detail/tab/materi,jsx/lessonDetail';
import ModulEdit from '../pages/instructor/course.jsx/edit/materi/modulEdit';
import LessonEdit from '../pages/instructor/course.jsx/edit/materi/lessonEdit';
import CourseAttributeAdd from '../pages/instructor/course.jsx/tambah/atributAdd';
import TentangKami from '../pages/tentangKami';
import Faq from '../pages/faq';
import KontakKami from '../pages/kontakKami';
import RingkasanEditInstructor from '../pages/instructor/course.jsx/edit/ringkasanEditInstructor';
import RingkasanEditAdmin from '../pages/admin/course/detail/ringkasanEditAdmin';
import InstructorProfile from '../pages/instructor/profile/profile';
import InstructorProfileEdit from '../pages/instructor/profile/profileEdit';
import InstructorDetail from '../pages/admin/user/instructorDetail';

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

const RoleBasedRedirect = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/beranda" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'instructor') {
    return <Navigate to="/instruktur/dashboard" replace />;
  }

  // fallback jika role tidak dikenali
  return <Navigate to="/beranda" replace />;
};

const ValidatedCourseDetailInstructor = () => {
  const { tab } = useParams();
  const validTabs = ['ringkasan', 'atribut', 'materi', 'ulasan'];

  if (!validTabs.includes(tab)) {
    return <Navigate to="/not-found" replace />;
  }

  return <CuourseDetailInstructor />;
};

const adminRoutes = [
  { path: 'dashboard', element: <DashboardAdmin /> },
  { path: 'kategori', element: <Category /> },
  { path: 'kategori/tambah', element: <CategoryAdd /> },
  { path: 'kategori/edit/:id', element: <CategoryEdit /> },
  { path: 'instruktur', element: <Instructor /> },
  { path: 'instruktur/:id', element: <InstructorDetail /> },
  { path: 'instruktur/tambah', element: <InstructorAdd /> },
  { path: 'kursus', element: <Course /> },
  { path: 'kursus/tambah', element: <CourseAdd /> },
  { path: 'kursus/:id/lihat/:tab', element: <CuourseDetailAdmin /> },
  { path: 'kursus/:id/edit/ringkasan/', element: <RingkasanEditAdmin /> },
  { path: 'materi/:lessonId/lihat', element: <LessonDetail /> },
];

const instructorRoutes = [
  { path: 'dashboard', element: <DashboardInstructor /> },
  { path: 'profile', element: <InstructorProfile /> },
  { path: 'profile/edit', element: <InstructorProfileEdit /> },
  { path: 'kursus', element: <CourseAdmin /> },
  { path: 'kursus/:id/lihat/:tab', element: <ValidatedCourseDetailInstructor /> },
  { path: 'kursus/:id/edit/ringkasan/', element: <RingkasanEditInstructor /> },
  { path: 'kursus/:courseId/tambah/persyaratan-deskripsi', element: <CourseAttributeAdd /> },
  {
    path: 'kursus/:courseId/edit/persyaratan-deskripsi/:attributeId?',
    element: <CourseAttributeEdit />,
  },
  { path: 'kursus/:courseId/modul/tambah', element: <ModulAdd /> },
  { path: 'kursus/:courseId/modul/:moduleId/edit', element: <ModulEdit /> },
  { path: 'kursus/:courseId/modul/:moduleId/materi/tambah', element: <LessonAdd /> },
  { path: 'materi/:lessonId/lihat', element: <LessonDetail /> },
  { path: 'materi/:lessonId/edit', element: <LessonEdit /> },
];

const publicRoutes = [
  { path: '/', element: <RoleBasedRedirect /> },
  { path: '/beranda', element: <Beranda2 /> },
  { path: '/masuk', element: <Login /> },
  { path: '/daftar', element: <Register /> },
  { path: '/coba-fungsi', element: <Payment /> },
  { path: '/tentang-kami', element: <TentangKami /> },
  { path: '/faq', element: <Faq /> },
  { path: '/kontak-kami', element: <KontakKami /> },
];

const PublicRoute = ({ children }) => {
  const { user } = useAuthStore();
  if (user && (user.role === 'admin' || user.role === 'instructor')) {
    return <NotFound />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route '/' tanpa PublicRoute */}
      <Route path="/" element={<RoleBasedRedirect />} />
      {/* Public routes lain */}
      {publicRoutes
        .filter((route) => route.path !== '/')
        .map((route, idx) => (
          <Route key={idx} path={route.path} element={<PublicRoute>{route.element}</PublicRoute>} />
        ))}
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
      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
