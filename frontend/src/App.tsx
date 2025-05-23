import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import store from './presentation/redux/store';
import './index.css';
import { useRefreshToken } from './application/hooks/useRefreshToken';
import { ProtectedRoute } from './presentation/components/ProtectedRoute';

// Layouts
import PublicLayout from './presentation/Layout/PublicLayout';
import UGLayout from './presentation/Layout/UGLayout';
import AdminLayout from './presentation/Layout/AdminLayout';
import UserLayout from './presentation/Layout/UserLayout';
import FacultyLayout from './presentation/Layout/FacultyLayout';

// Pages
import { Home } from './presentation/pages/main/Home';
import { Admissions } from './presentation/pages/main/Admissions';
import ContactUs from './presentation/components/ContactUs';
import { Education } from './presentation/pages/main/Education';
import { About } from './presentation/pages/main/About';
import LoginPage from './presentation/pages/Auth/Login';
import RegisterPage from './presentation/pages/Auth/Register';
import { ApplicationForm } from './presentation/pages/ApplicationForm';
import UniversityAdminDashboard from './presentation/pages/admin/Dasboard';
import UserManagement from './presentation/pages/admin/User/UserManagement';
import { UGHome } from './presentation/pages/ug_admissions/UGHome';
import { UGAdmissions } from './presentation/pages/ug_admissions/UGAdmissions';
import UGProgrammes from './presentation/pages/ug_admissions/UGProgrammes';
import { UGScholarships } from './presentation/pages/ug_admissions/UGScholarships';
import { UGWhy_VAGO } from './presentation/pages/ug_admissions/UGWhy_VAGO';
import DashboardPage from './presentation/pages/user/Dashboard/StudentDashboard';
import CanvasPage from './presentation/pages/CanvasPage';
import FacultyDashboard from './presentation/pages/faculty/FacultyDashboard';
import FacultyRequestForm from './presentation/pages/Auth/FacultyRequest';
import ConfirmAdmission from './presentation/pages/ConfirmAdmission';
import FacultyManagement from './presentation/pages/admin/FacultyManagement';
import ConfirmFaculty from './presentation/pages/ConfirmFaculty';
import Setting from './presentation/pages/user/Settings/Setting';
import {ForgotPasswordModal} from './presentation/pages/ForgotPassword';
import { useNavigate } from 'react-router-dom';
import VideoManagementPage from './presentation/pages/admin/vedio/VedioManagement';
import AdminCourseManagement from './presentation/pages/admin/course/CourseManagement';
import AdminClubManagement from './presentation/pages/admin/campusLife/clubs/ClubManagement';
import AdminSportsManagement from './presentation/pages/admin/campusLife/sports/SportsManagement';
import AdminEventsManagement from './presentation/pages/admin/campusLife/events/EventsManagement';

const App: React.FC = () => {
  const { isError, error } = useRefreshToken();
  const navigate = useNavigate();

  if (isError) {
    console.log('Refresh token failed:', error);
    store.dispatch({ type: 'auth/logout' }); 
  }

  return (
    <Provider store={store}>
      <Routes>
        {/* Login, Register and Faculty Request Routes (unauthenticated only) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={[]} isPublic={true} />
          }
        >
          <Route element={<PublicLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordModal isOpen={true} onClose={() => { navigate(-1) || navigate('/login') }} />} />
            <Route path="faculty/request" element={<FacultyRequestForm />} />
          </Route>
        </Route>

        {/* Public Routes (accessible by all except admin, and not /login or /register for logged-in) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={['register', 'user', 'faculty']} isPublic={true} />
          }
        >
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="education" element={<Education />} />
            <Route path="about" element={<About />} />
            <Route path="confirm-admission/:id/:action" element={<ConfirmAdmission />} />
          </Route>
          <Route element={<UGLayout />}>
            <Route path="ug" element={<UGHome />} />
            <Route path="ug/admissions" element={<UGAdmissions />} />
            <Route path="ug/programmes" element={<UGProgrammes />} />
            <Route path="ug/scholarships" element={<UGScholarships />} />
            <Route path="ug/why-vago" element={<UGWhy_VAGO />} />
            <Route path="ug/contact" element={<ContactUs />} />
          </Route>
        </Route>

        {/* Admission Route (register only) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={['register']} />
          }
        >
          <Route path="admission" element={<ApplicationForm />} />
        </Route>

        {/* Admin Routes (admin only) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={['admin']} />
          }
        >
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<UniversityAdminDashboard />} />
            <Route path="admin/user" element={<UserManagement />} />
            <Route path="admin/faculty" element={<FacultyManagement />} /> 
            <Route path="admin/course-management" element={<AdminCourseManagement />} />
            <Route path="admin/content" element={<VideoManagementPage />} />
            <Route path="admin/clubs" element={<AdminClubManagement />} />
            <Route path="admin/sports" element={<AdminSportsManagement />} />
            <Route path="admin/events" element={<AdminEventsManagement />} />
          </Route>
        </Route>

        {/* User Routes (user only) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={['user']} />
          }
        >
          <Route element={<UserLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="settings" element={<Setting />} />
            <Route path="canvas" element={<CanvasPage />} />
          </Route>
        </Route>

        {/* Faculty Routes (faculty only) */}
        <Route
          element={
            <ProtectedRoute allowedCollections={['faculty']} />
          }
        >
          <Route element={<FacultyLayout />}>
            <Route path="faculty/courses" element={<FacultyDashboard />} />
          </Route>
        </Route>

        {/* Confirm Faculty Route */}
        <Route path="/confirm-faculty/:id/:action" element={<ConfirmFaculty />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Provider>
  );
};

export default App;