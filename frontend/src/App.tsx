import React from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import DepartmentLayout from './presentation/Layout/DepartmentLayout';
import ApplicationFormLayout from './presentation/Layout/ApplicationFormLayout';

// Pages
import { Home } from './presentation/pages/main/Home';
import { HighlightsPage } from './presentation/pages/main/HighlightsPage';
import { VagoNowPage } from './presentation/pages/main/VagoNowPage';
import { LeadershipPage } from './presentation/pages/main/LeadershipPage';
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
import FacultyDashboard from './presentation/pages/faculty/FacultyDashboard';
import FacultyRequestForm from './presentation/pages/Auth/FacultyRequest';
import ConfirmAdmission from './presentation/pages/ConfirmAdmission';
import FacultyManagement from './presentation/pages/admin/FacultyManagement';
import ConfirmFaculty from './presentation/pages/ConfirmFaculty';
import Setting from './presentation/pages/user/Settings/Setting';
import FacultySettings from './presentation/pages/faculty/settings/FacultySettings';
import { useNavigate } from 'react-router-dom';
import VideoManagementPage from './presentation/pages/admin/vedio/VedioManagement';
import AdminCourseManagement from './presentation/pages/admin/course/CourseManagement';
import AdminClubManagement from './presentation/pages/admin/campusLife/clubs/ClubManagement';
import AdminSportsManagement from './presentation/pages/admin/campusLife/sports/SportsManagement';
import AdminEventsManagement from './presentation/pages/admin/campusLife/events/EventsManagement';
import CommunicationManagement from './presentation/pages/admin/communication/CommunicstionManagement';
import PaymentManagement from './presentation/pages/admin/payment/PaymentManagement';
import ComputerScience from './presentation/pages/departments/ComputerScience';
import Business from './presentation/pages/departments/Business';
import DepartmentHome from './presentation/pages/departments/DepartmentHome';
import DepartmentAbout from './presentation/pages/departments/DepartmentAbout';
import DepartmentEducation from './presentation/pages/departments/DepartmentEducation';
import DepartmentCommunity from './presentation/pages/departments/DepartmentCommunity';
import DepartmentEntrepreneur from './presentation/pages/departments/DepartmentEntrepreneur';
import HelpSupportPage from './presentation/pages/HelpSupportPage';
import ForgotPasswordModal from './presentation/pages/ForgotPassword';
import ProgramPrerequisites from './presentation/pages/ProgramPrerequisites';
import ScholarshipComponent from './presentation/pages/ScholarshipComponent';
import NotificationManagement from './presentation/pages/admin/notification/NotificationManagement';
import StudentCanvas from './presentation/pages/canvas/CanvasPage';
import DiplomaManagement from './presentation/pages/admin/diploma/DiplomaManagement';
import MaterialManagement from './presentation/pages/admin/material/MaterialManagement';
import AssignmentManagement from './presentation/pages/faculty/assignment/AssignmentManagement';
import SessionManagement from './presentation/pages/faculty/sessions/SessionManagement';
import SiteManagement from './presentation/pages/admin/sites/SiteManagement';

const App: React.FC = () => {
  const { isError, error } = useRefreshToken();
  const navigate = useNavigate();

  if (isError) {
    console.log('Refresh token failed:', error);
    store.dispatch({ type: 'auth/logout' });
  }

  // Define departments array
  const departments = [
    { path: 'computer-science', component: ComputerScience },
    { path: 'business', component: Business },
    // Add more departments here as needed
    // { path: 'engineering', component: Engineering },
  ];

  // Define sub-routes for each department
  const departmentSubRoutes = [
    { path: '', element: <DepartmentHome /> }, // Home page for the department
    { path: 'about', element: <DepartmentAbout /> },
    { path: 'program', element: <DepartmentEducation /> },
    { path: 'community', element: <DepartmentCommunity /> },
    { path: 'entrepreneur', element: <DepartmentEntrepreneur /> },
    { path: 'contact', element: <ContactUs /> },
    // Add login and register as sub-routes under departments
    {
      path: 'login',
      element: <LoginPage />,
      state: { fromLayout: 'department' },
    },
    {
      path: 'register',
      element: <RegisterPage />,
      state: { fromLayout: 'department' },
    },
  ];

  return (
    <Provider store={store}>
      <Routes>
        {/* Login, Register, and Faculty Request Routes (unauthenticated only) */}
        <Route element={<ProtectedRoute allowedCollections={[]} isPublic={true} />}>
          <Route element={<PublicLayout />}>
            <Route path="login" element={<LoginPage />} state={{ fromLayout: 'public' }} />
            <Route path="register" element={<RegisterPage />} state={{ fromLayout: 'public' }} />
            <Route
              path="forgot-password"
              element={
                <ForgotPasswordModal
                  isOpen={true}
                  onClose={() => navigate(-1) || navigate('/login')}
                />
              }
              state={{ fromLayout: 'public' }}
            />
            <Route path="faculty/request" element={<FacultyRequestForm />} state={{ fromLayout: 'public' }} />
          </Route>

          <Route element={<UGLayout />}>
            <Route path="ug/login" element={<LoginPage />} state={{ fromLayout: 'ug' }} />
            <Route path="ug/register" element={<RegisterPage />} state={{ fromLayout: 'ug' }} />
          </Route>
        </Route>

        {/* Public Routes (accessible by all except admin, and not /login or /register for logged-in) */}
        <Route element={<ProtectedRoute allowedCollections={['register', 'user', 'faculty']} isPublic={true} />}>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="highlights" element={<HighlightsPage />} />
            <Route path="vago-now" element={<VagoNowPage />} />
            <Route path="leadership" element={<LeadershipPage />} />
            <Route path="admissions" element={<Admissions />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="education" element={<Education />} />
            <Route path="about" element={<About />} />
            <Route path='program-prerequisites' element={<ProgramPrerequisites />} />
            <Route path='undergraduate-scholarships' element={<ScholarshipComponent />} />
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

        {/* Confirm Admission Route (no authentication required) */}
        <Route path="/confirm-admission/:id/:action" element={<ConfirmAdmission />} />

        {/* Admission Route (register only) */}
        <Route element={<ProtectedRoute allowedCollections={['register']} />}>
          <Route path="admission" element={<ApplicationFormLayout>
            <ApplicationForm />
          </ApplicationFormLayout>} />
        </Route>

        {/* Admin Routes (admin only) */}
        <Route element={<ProtectedRoute allowedCollections={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path="admin" element={<UniversityAdminDashboard />} />
            <Route path="admin/user" element={<UserManagement />} />
            <Route path="admin/faculty" element={<FacultyManagement />} />
            <Route path="admin/course-management" element={<AdminCourseManagement />} />
            <Route path="admin/content" element={<VideoManagementPage />} />
            <Route path="admin/clubs" element={<AdminClubManagement />} />
            <Route path="admin/sports" element={<AdminSportsManagement />} />
            <Route path="admin/events" element={<AdminEventsManagement />} />
            <Route path="admin/communication" element={<CommunicationManagement />} />
            <Route path="admin/payment" element={<PaymentManagement />} />
            <Route path="admin/notifications" element={<NotificationManagement />} />
            <Route path="admin/diploma-courses" element={<DiplomaManagement />} />
            <Route path="admin/material" element={<MaterialManagement />} />
            <Route path="admin/site-management" element={<SiteManagement />} />
          </Route>
        </Route>

        {/* User Routes (user only) */}
        <Route element={<ProtectedRoute allowedCollections={['user']} />}>
          <Route element={<UserLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="canvas" element={<StudentCanvas />} />
          </Route>
        </Route>

        {/* Settings Route (user only, independent layout) */}
        <Route element={<ProtectedRoute allowedCollections={['user']} />}>
          <Route path="settings" element={<Setting />} />
          <Route path='help' element={<HelpSupportPage />} />
        </Route>

        {/* Faculty Routes (faculty only) */}
        <Route element={<ProtectedRoute allowedCollections={['faculty']} />}>
          <Route element={<FacultyLayout />}>
            <Route path="faculty" element={<FacultyDashboard />} />
            <Route path="faculty/assignments" element={<AssignmentManagement />} />
            <Route path="faculty/sessions" element={<SessionManagement />} />
          </Route>
        </Route>

        {/* Faculty Settings Route (faculty only, independent layout) */}
        <Route element={<ProtectedRoute allowedCollections={['faculty']} />}>
          <Route path="faculty/settings" element={<FacultySettings />} />
        </Route>

        {/* Confirm Faculty Route */}
        <Route path="/confirm-faculty/:id/:action" element={<ConfirmFaculty />} />

        {/* Department Routes */}
        <Route path="/departments" element={<DepartmentLayout />}>
          {departments.map((dept) => (
            <Route key={dept.path} path={dept.path} element={<dept.component />}>
              {departmentSubRoutes.map((subRoute, index) => (
                <Route
                  key={index}
                  path={subRoute.path}
                  element={subRoute.element}
                  {...(subRoute.state ? { state: subRoute.state } : {})}
                />
              ))}
            </Route>
          ))}
          {/* Redirect if department is not found */}
          <Route path="*" element={<Navigate to="/departments/computer-science" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Provider>
  );
};

export default App;