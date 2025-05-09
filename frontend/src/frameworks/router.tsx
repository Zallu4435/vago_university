// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import PublicLayout from '../presentation/Layout/PublicLayout';
// import Login from '../presentation/pages/Auth/Login';
// // import Register from '../../presentation/pages/Auth/Register';
// // import Apply from '../presentation/pages/Admission/Apply'
// // import Offer from '../../presentation/pages/Admission/Offer';
// // import Unauthorized from '../../presentation/pages/Unauthorized';
// // import AdminLayout from '../../presentation/components/AdminLayout';
// // import UserLayout from '../../presentation/components/UserLayout';
// // import CanvasLayout from '../../presentation/components/CanvasLayout';
// // import FacultyLayout from '../../presentation/components/FacultyLayout';
// // import ProtectedRoute from '../../presentation/components/ProtectedRoute';
// // import AdminDashboard from '../../presentation/pages/Admin/Dashboard';
// // import AdminUsers from '../../presentation/pages/Admin/Users';
// // import AdminApplications from '../../presentation/pages/Admin/Applications';
// // import UserDashboard from '../../presentation/pages/User/Dashboard';
// // import UserProfile from '../../presentation/pages/User/Profile';
// // import UserCourses from '../../presentation/pages/User/Courses';
// // import CanvasDashboard from '../../presentation/pages/Canvas/Dashboard';
// // import CanvasAssignments from '../../presentation/pages/Canvas/Assignments';
// // import CanvasGrades from '../../presentation/pages/Canvas/Grades';
// // import FacultyDashboard from '../../presentation/pages/Faculty/Dashboard';
// // import FacultyCourses from '../../presentation/pages/Faculty/Courses';
// // import FacultyStudents from '../../presentation/pages/Faculty/Students';

// const router = createBrowserRouter([
//   {
//     element: <PublicLayout />,
//     children: [
//       { path: '/login', element: <Login /> },
//     //   { path: '/register', element: <Register /> },
//     //   { path: '/apply', element: <Apply /> },
//     //   { path: '/admissions/accept/:token', element: <Offer /> },
//       { path: '/', element: <Login /> },
//     ],
//   },

// //   {
// //     path: '/admin',
// //     element: (
// //       <ProtectedRoute allowedRoles={['admin']}>
// //         <AdminLayout />
// //       </ProtectedRoute>
// //     ),
// //     children: [
// //       { path: '', element: <AdminDashboard /> },
// //       { path: 'users', element: <AdminUsers /> },
// //       { path: 'applications', element: <AdminApplications /> },
// //     ],
// //   },
// //   {
// //     path: '/user',
// //     element: (
// //       <ProtectedRoute allowedRoles={['student']}>
// //         <UserLayout />
// //       </ProtectedRoute>
// //     ),
// //     children: [
// //       { path: '', element: <UserDashboard /> },
// //       { path: 'profile', element: <UserProfile /> },
// //       { path: 'courses', element: <UserCourses /> },
// //     ],
// //   },

// //   {
// //     path: '/canvas',
// //     element: (
// //       <ProtectedRoute allowedRoles={['student', 'faculty']}>
// //         <CanvasLayout />
// //       </ProtectedRoute>
// //     ),
// //     children: [
// //       { path: '', element: <CanvasDashboard /> },
// //       { path: 'assignments', element: <CanvasAssignments /> },
// //       { path: 'grades', element: <CanvasGrades /> },
// //     ],
// //   },

// //   {
// //     path: '/faculty',
// //     element: (
// //       <ProtectedRoute allowedRoles={['faculty']}>
// //         <FacultyLayout />
// //       </ProtectedRoute>
// //     ),
// //     children: [
// //       { path: '', element: <FacultyDashboard /> },
// //       { path: 'courses', element: <FacultyCourses /> },
// //       { path: 'students', element: <FacultyStudents /> },
// //     ],
// //   },

// //   { path: '/unauthorized', element: <Unauthorized /> },
// ]);

// const AppRouter: React.FC = () => <RouterProvider router={router} />;

// export default AppRouter;