import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import store from './appStore/store';
import './index.css';
import { ProtectedRoute } from './frameworks/router/ProtectedRoute';
import { AuthProvider } from './presentation/components/auth/AuthProvider';

// Layouts - Keep these loaded initially
import PublicLayout from './presentation/Layout/PublicLayout';
import UGLayout from './presentation/Layout/UGLayout';
import AdminLayout from './presentation/Layout/AdminLayout';
import UserLayout from './presentation/Layout/UserLayout';
import FacultyLayout from './presentation/Layout/FacultyLayout';
import DepartmentLayout from './presentation/Layout/DepartmentLayout';
import ApplicationFormLayout from './presentation/Layout/ApplicationFormLayout';

// Essential pages - Load immediately for better UX
import { Home } from './presentation/pages/main/Home';
import { Admissions } from './presentation/pages/main/Admissions';
import { Education } from './presentation/pages/main/Education';
import { About } from './presentation/pages/main/About';
import ContactUs from './presentation/pages/static/ContactUs';
import LoginPage from './presentation/pages/Auth/Login';
import RegisterPage from './presentation/pages/Auth/Register';

// Lazy load non-essential pages
const HighlightsPage = lazy(() => import('./presentation/pages/main/HighlightsPage').then(module => ({ default: module.HighlightsPage })));
const VagoNowPage = lazy(() => import('./presentation/pages/main/VagoNowPage').then(module => ({ default: module.VagoNowPage })));
const LeadershipPage = lazy(() => import('./presentation/pages/main/LeadershipPage').then(module => ({ default: module.LeadershipPage })));
const ApplicationForm = lazy(() => import('./presentation/pages/application/ApplicationForm').then(module => ({ default: module.ApplicationForm })));
const AdminDashboard = lazy(() => import('./presentation/pages/admin/Dasboard'));
const UserManagement = lazy(() => import('./presentation/pages/admin/User/UserManagement'));
const UGHome = lazy(() => import('./presentation/pages/ug_admissions/UGHome').then(module => ({ default: module.UGHome })));
const UGAdmissions = lazy(() => import('./presentation/pages/ug_admissions/UGAdmissions').then(module => ({ default: module.UGAdmissions })));
const UGProgrammes = lazy(() => import('./presentation/pages/ug_admissions/UGProgrammes'));
const UGScholarships = lazy(() => import('./presentation/pages/ug_admissions/UGScholarships').then(module => ({ default: module.UGScholarships })));
const UGWhy_VAGO = lazy(() => import('./presentation/pages/ug_admissions/UGWhy_VAGO').then(module => ({ default: module.UGWhy_VAGO })));
const DashboardPage = lazy(() => import('./presentation/pages/user/Dashboard/StudentDashboard'));
const FacultyDashboard = lazy(() => import('./presentation/pages/faculty/dashboard/FacultyDashboard'));
const FacultyRequestForm = lazy(() => import('./presentation/pages/Auth/FacultyRequest'));
const ConfirmAdmission = lazy(() => import('./presentation/pages/Auth/ConfirmAdmission'));
const ConfirmRegistration = lazy(() => import('./presentation/pages/Auth/ConfirmRegistration'));
const FacultyManagement = lazy(() => import('./presentation/pages/admin/faculty/FacultyManagement'));
const ConfirmFaculty = lazy(() => import('./presentation/pages/Auth/ConfirmFaculty'));
const Setting = lazy(() => import('./presentation/pages/user/Settings/Setting'));
const FacultySettings = lazy(() => import('./presentation/pages/faculty/settings/FacultySettings'));
const VideoManagementPage = lazy(() => import('./presentation/pages/admin/vedio/VedioManagement'));
const AdminCourseManagement = lazy(() => import('./presentation/pages/admin/course/CourseManagement'));
const AdminClubManagement = lazy(() => import('./presentation/pages/admin/campusLife/clubs/ClubManagement'));
const AdminSportsManagement = lazy(() => import('./presentation/pages/admin/campusLife/sports/SportsManagement'));
const AdminEventsManagement = lazy(() => import('./presentation/pages/admin/campusLife/events/EventsManagement'));
const CommunicationManagement = lazy(() => import('./presentation/pages/admin/communication/CommunicstionManagement'));
const PaymentManagement = lazy(() => import('./presentation/pages/admin/payment/PaymentManagement'));
const ComputerScience = lazy(() => import('./presentation/pages/departments/ComputerScience'));
const Business = lazy(() => import('./presentation/pages/departments/Business'));
const DepartmentHome = lazy(() => import('./presentation/pages/departments/DepartmentHome'));
const DepartmentAbout = lazy(() => import('./presentation/pages/departments/DepartmentAbout'));
const DepartmentEducation = lazy(() => import('./presentation/pages/departments/DepartmentEducation'));
const DepartmentCommunity = lazy(() => import('./presentation/pages/departments/DepartmentCommunity'));
const DepartmentEntrepreneur = lazy(() => import('./presentation/pages/departments/DepartmentEntrepreneur'));
const HelpSupportPage = lazy(() => import('./presentation/pages/static/HelpSupportPage'));
const ForgotPasswordModal = lazy(() => import('./presentation/pages/Auth/ForgotPassword'));
const ProgramPrerequisites = lazy(() => import('./presentation/pages/static/ProgramPrerequisites'));
const ScholarshipComponent = lazy(() => import('./presentation/pages/static/ScholarshipComponent'));
const NotificationManagement = lazy(() => import('./presentation/pages/admin/notification/NotificationManagement'));
const StudentCanvas = lazy(() => import('./presentation/pages/canvas/CanvasPage'));
const DiplomaManagement = lazy(() => import('./presentation/pages/admin/diploma/DiplomaManagement'));
const MaterialManagement = lazy(() => import('./presentation/pages/admin/material/MaterialManagement'));
const AssignmentManagement = lazy(() => import('./presentation/pages/faculty/assignment/AssignmentManagement'));
const SessionManagement = lazy(() => import('./presentation/pages/faculty/sessions/SessionManagement'));
const SiteManagement = lazy(() => import('./presentation/pages/admin/sites/SiteManagement'));
const VideoConferencePage = lazy(() => import('./presentation/pages/VideoConference/VideoConferencePage').then(module => ({ default: module.VideoConferencePage })));
const EnquiryManagement = lazy(() => import('./presentation/pages/admin/enquiry/EnquiryManagement'));
const SessionAttendancePage = lazy(() => import('./presentation/pages/faculty/attendance/SessionAttendancePage'));
const AttendanceSummaryPage = lazy(() => import('./presentation/pages/faculty/attendance/AttendanceSummaryPage'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50 via-white to-cyan-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
      <p className="text-cyan-600 font-medium">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
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
      <AuthProvider>
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
              <Route path="highlights" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <HighlightsPage />
                </Suspense>
              } />
              <Route path="vago-now" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <VagoNowPage />
                </Suspense>
              } />
              <Route path="leadership" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <LeadershipPage />
                </Suspense>
              } />
              <Route path="admissions" element={<Admissions />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="education" element={<Education />} />
              <Route path="about" element={<About />} />
              <Route path='program-prerequisites' element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ProgramPrerequisites />
                </Suspense>
              } />
              <Route path='undergraduate-scholarships' element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ScholarshipComponent />
                </Suspense>
              } />
            </Route>
            <Route element={<UGLayout />}>
              <Route path="ug" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UGHome />
                </Suspense>
              } />
              <Route path="ug/admissions" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UGAdmissions />
                </Suspense>
              } />
              <Route path="ug/programmes" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UGProgrammes />
                </Suspense>
              } />
              <Route path="ug/scholarships" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UGScholarships />
                </Suspense>
              } />
              <Route path="ug/why-vago" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UGWhy_VAGO />
                </Suspense>
              } />
              <Route path="ug/contact" element={<ContactUs />} />
            </Route>
          </Route>

          {/* Confirm Admission Route (no authentication required) */}
          <Route path="/confirm-admission/:id/:action" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ConfirmAdmission />
            </Suspense>
          } />

          {/* Admission Route (register only) */}
          <Route element={<ProtectedRoute allowedCollections={['register']} />}>
            <Route path="admission" element={<ApplicationFormLayout>
              <Suspense fallback={<LoadingSpinner />}>
                <ApplicationForm />
              </Suspense>
            </ApplicationFormLayout>} />
          </Route>

          {/* Admin Routes (admin only) */}
          <Route element={<ProtectedRoute allowedCollections={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="admin" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="admin/user" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <UserManagement />
                </Suspense>
              } />
              <Route path="admin/faculty" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <FacultyManagement />
                </Suspense>
              } />
              <Route path="admin/course-management" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminCourseManagement />
                </Suspense>
              } />
              <Route path="admin/content" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <VideoManagementPage />
                </Suspense>
              } />
              <Route path="admin/clubs" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminClubManagement />
                </Suspense>
              } />
              <Route path="admin/sports" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminSportsManagement />
                </Suspense>
              } />
              <Route path="admin/events" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminEventsManagement />
                </Suspense>
              } />
              <Route path="admin/communication" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <CommunicationManagement />
                </Suspense>
              } />
              <Route path="admin/payment" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PaymentManagement />
                </Suspense>
              } />
              <Route path="admin/notifications" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <NotificationManagement />
                </Suspense>
              } />
              <Route path="admin/diploma-courses" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DiplomaManagement />
                </Suspense>
              } />
              <Route path="admin/material" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <MaterialManagement />
                </Suspense>
              } />
              <Route path="admin/site-management" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SiteManagement />
                </Suspense>
              } />
              <Route path="admin/enquiry" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <EnquiryManagement />
                </Suspense>
              } />
            </Route>
          </Route>

          {/* User Routes (user only) */}
          <Route element={<ProtectedRoute allowedCollections={['user']} />}>
            <Route element={<UserLayout />}>
              <Route path="dashboard" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardPage />
                </Suspense>
              } />
              <Route path="canvas" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <StudentCanvas />
                </Suspense>
              } />
            </Route>
          </Route>

          {/* Settings Route (user only, independent layout) */}
          <Route element={<ProtectedRoute allowedCollections={['user']} />}>
            <Route path="settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <Setting />
              </Suspense>
            } />
            <Route path='help' element={
              <Suspense fallback={<LoadingSpinner />}>
                <HelpSupportPage />
              </Suspense>
            } />
          </Route>

          {/* Faculty Routes (faculty only) */}
          <Route element={<ProtectedRoute allowedCollections={['faculty']} />}>
            <Route element={<FacultyLayout />}>
              <Route path="faculty" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <FacultyDashboard />
                </Suspense>
              } />
              <Route path="faculty/assignments" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AssignmentManagement />
                </Suspense>
              } />
              <Route path="faculty/sessions" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SessionManagement />
                </Suspense>
              } />
              <Route path="faculty/attendance" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SessionAttendancePage />
                </Suspense>
              } />
              <Route path="faculty/attendance-summary" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AttendanceSummaryPage />
                </Suspense>
              } />
            </Route>
          </Route>

          {/* Faculty Settings Route (faculty only, independent layout) */}
          <Route element={<ProtectedRoute allowedCollections={['faculty']} />}>
            <Route path="faculty/settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <FacultySettings />
              </Suspense>
            } />
          </Route>

          {/* Confirm Faculty Route */}
          <Route path="/confirm-faculty/:id/:action" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ConfirmFaculty />
            </Suspense>
          } />

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

          {/* Confirm Registration Route (no authentication required) */}
          <Route path="/confirm-registration" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ConfirmRegistration />
            </Suspense>
          } />

          {/* Video Conference Route (accessible to all authenticated users) */}
          <Route path="/faculty/video-conference/:sessionId" element={
            <Suspense fallback={<LoadingSpinner />}>
              <VideoConferencePage />
            </Suspense>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </AuthProvider>
    </Provider>
  );
};

export default App;